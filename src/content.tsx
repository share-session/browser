import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

function Root() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("__share");

  const [ignored, setIgnored] = useState(false);

  useEffect(() => {
    setIgnored(localStorage.getItem("__share:" + id) === "ignored");
  }, [id]);

  useEffect(() => {
    if (ignored) {
      localStorage.setItem("__share:" + id, "ignored");
    }
  }, [ignored]);

  if (!id || ignored) {
    return null;
  }

  function onIgnore() {
    setIgnored(true);
  }

  async function onUse() {
    const response = await fetch(
      "https://functions-share-session.vercel.app/api/s/" + id
    );
    const {
      cookies = [],
      localStorage = [],
      sessionStorage = [],
    } = await response.json();

    for (const cookie of cookies) {
      setCookie(cookie.name, cookie.value);
    }

    for (const item of localStorage) {
      window.localStorage.setItem(item.name, item.value);
    }

    for (const item of sessionStorage) {
      window.sessionStorage.setItem(item.name, item.value);
    }
  }

  return (
    <div className="share-session-content">
      <div className="flex gap-4 p-4">
        <button
          className="share-session-button share-session-button-secondary min-w-32"
          onClick={onIgnore}
        >
          Ignore
        </button>
        <button
          className="share-session-button share-session-button-primary min-w-32"
          onClick={onUse}
        >
          Use session
        </button>
      </div>
    </div>
  );
}

export function setCookie(name: string, value: string) {
  const date = new Date();

  // Set it to expire in 7 days
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Set it
  document.cookie =
    name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
}

function render() {
  if (!document.body) {
    setTimeout(render, 250);
    return;
  }

  const root = document.createElement("share-session");

  document.body.appendChild(root);

  createRoot(root).render(<Root />);
}

render();

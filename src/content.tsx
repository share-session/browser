import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

function Root() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("__share");

  const [show, setShow] = useState(false);

  useEffect(() => {
    const state = localStorage.getItem("__share:" + id);

    const ignored = state === "ignored";

    setShow(!ignored);
  }, [id]);

  if (!id) {
    return null;
  }

  function onIgnore() {
    localStorage.setItem("__share:" + id, "ignored");

    setShow(false);
  }

  async function onUse() {
    const response = await fetch(
      "https://functions.share-session.com/api/s/" + id
    );

    const { cookies, localStorage, sessionStorage } = await response.json();

    process(cookies, setCookie);
    process(localStorage, window.localStorage.setItem);
    process(sessionStorage, window.sessionStorage.setItem);

    const params = new URLSearchParams(window.location.search);

    params.delete("__share");

    window.location.search = params.toString();
  }

  return (
    <div
      className={classnames(
        "bg-white fixed left-5 sm:left-auto bottom-5 right-5 text-black shadow-md rounded-xl transition",
        {
          "opacity-0 translate-y-[40px]": !show,
          "opacity-100 translate-y-0": show,
        }
      )}
    >
      <div className="flex sm:flex-row flex-col-reverse gap-4 p-4">
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

function process(
  data: Record<string, any> | Array<{ name: string; value: any }>,
  handler: (name: string, value: any) => void
) {
  if (!data) {
    return;
  }

  const entries = Array.isArray(data)
    ? data.map((item) => [item.name, item.value])
    : Object.entries(data);

  for (const [key, value] of entries) {
    handler(key, value);
  }
}

function classnames(...classes: Array<string | Record<string, any>>) {
  return classes
    .filter((s) => s)
    .map((c) => {
      if (typeof c === "object") {
        const entries = Object.entries(c);
        const filtered = entries.filter(([, value]) => value);
        const mapped = filtered.map((value) => value[0]);
        return mapped.join(" ");
      }

      return c;
    })
    .join(" ");
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

import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

const root = document.createElement("share-session");
document.body.appendChild(root);

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

  async function onUse() {
    const response = await fetch("https://api.share-session.com/s/" + id);
    const {
      cookies = [],
      localStorage = [],
      sessionStorage,
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
    <div className="bg-white fixed bottom-5 right-5 text-black px-3 py-3 shadow-md">
      <div className="mb-2 text-sm text-center font-medium">
        Detected session
      </div>

      <div className="grid grid-cols-2 h-10 w-44 gap-2">
        <button
          className="text-sm bg-gray-200 text-black/90 border border-black/20"
          onClick={() => setIgnored(true)}
        >
          Ignore
        </button>
        <button
          className="text-sm bg-gradient-to-br from-pink-500 to-red-400 text-black/90 order border-black/20"
          onClick={onUse}
        >
          Use
        </button>
      </div>
    </div>
  );
}

export function setCookie(name: string, val: string) {
  console.log("setting cookie", name, val);

  const date = new Date();
  const value = val;

  // Set it to expire in 7 days
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Set it
  document.cookie =
    name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
}

createRoot(root).render(<Root />);

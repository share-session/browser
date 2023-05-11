import React from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

const root = document.createElement("div");
root.id = "share-session-root";
document.body.appendChild(root);

function Root() {
  return <div className="gbg-red-500">🍆</div>;
}

createRoot(root).render(<Root />);

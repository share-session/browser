console.log("Hello, world!")
import React from 'react';
import { createRoot } from 'react-dom/client'

const root = document.createElement("div")
root.id = "root"
document.body.appendChild(root);

createRoot(root).render(<div>🍆</div>);


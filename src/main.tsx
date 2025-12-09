import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import "@rainbow-me/rainbowkit/styles.css";//这里导入rainbow样式弹窗样式失效，不知道为什么，从index.css中导入就没问题
import "./index.css";

const container = document.getElementById("root");
if (!container) {
	throw new Error(
		'Root container not found: ensure there is an element with id="root" in index.html',
	);
}
const root = createRoot(container);
console.log("Rendering App component into #root");
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);

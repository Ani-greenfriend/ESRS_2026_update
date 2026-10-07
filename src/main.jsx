import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/app.css";
import App from "./App.jsx";
import Privacy from "./components/Privacy.jsx";

const isPrivacy = window.location.pathname.replace(/\/+$/, "") === "/privacy";
if (isPrivacy) document.title = "Privacy notice · Revised ESRS Check";

createRoot(document.getElementById("root")).render(
  <StrictMode>{isPrivacy ? <Privacy /> : <App />}</StrictMode>
);

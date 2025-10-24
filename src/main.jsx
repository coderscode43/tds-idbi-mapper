// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import StaticDataProvider from "./context/StaticDataProvider";
import "./main.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <StaticDataProvider>
    <App />
  </StaticDataProvider>
  // </StrictMode>
);

// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import StatusProvider from "./context/ModalsContext/StatusProvider.jsx";
import StaticDataProvider from "./context/StaticDataProvider";
import "./main.css";

createRoot(document.getElementById("root")).render(
  <StatusProvider>
    <StaticDataProvider>
      <App />
    </StaticDataProvider>
  </StatusProvider>
);

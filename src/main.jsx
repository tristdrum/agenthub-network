import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { initAnalytics } from "@/lib/analytics";

initAnalytics();

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

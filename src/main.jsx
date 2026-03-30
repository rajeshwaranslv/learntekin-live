import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(
      window.location.hostname
    );

    if (!isLocalhost && import.meta.env.PROD) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Swallow registration errors to avoid breaking app startup.
      });
    }
  });
}

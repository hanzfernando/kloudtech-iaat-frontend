import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./styles.css";
import { ThemeProvider } from "./providers/ThemeProvider";

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>
  );
}

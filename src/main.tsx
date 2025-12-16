
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { validateEnvironment } from "./lib/security.ts";

// Validate environment variables on startup
try {
  validateEnvironment();
} catch (error) {
  console.error('Environment validation failed:', error);
  // Show user-friendly error message
  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 20px;
    ">
      <div style="
        background: rgba(255, 255, 255, 0.95);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 500px;
      ">
        <h1 style="color: #e53e3e; margin-bottom: 20px;">Configuration Error</h1>
        <p style="color: #4a5568; margin-bottom: 20px; line-height: 1.6;">
          ${error instanceof Error ? error.message : 'Environment configuration is missing or invalid.'}
        </p>
        <p style="color: #718096; font-size: 14px;">
          Please check your .env file and ensure all required environment variables are properly configured.
        </p>
      </div>
    </div>
  `;
  throw error;
}

createRoot(document.getElementById("root")!).render(<App />);
  
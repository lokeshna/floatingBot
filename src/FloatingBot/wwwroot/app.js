import * as __FB_R from "https://esm.sh/react@18.3.1";
import React from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

// CopilotKit CDN imports were removed because some nested CSS deps
// (e.g. KaTeX) are requested as module scripts and cause MIME errors
// in the browser. The local fallback UI does not require those packages.

// Styles are loaded via a <link> tag in index.html.

const e = React.createElement;

// Hardcoded public key provided by the developer — used to mount CopilotKit.
const HARDCODED_PUBLIC_KEY = "ck_pub_15254ec35f90794301e47df2e9b56366";

async function sendLocalMessage(message) {
  const response = await fetch("/api/agent/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  if (!response.ok) throw new Error("Local agent failed to respond.");
  const payload = await response.json();
  return payload.message;
}

// The CopilotKit UI is mounted dynamically in `bootstrap` using the
// hardcoded public API key provided by the developer. The App wrapper
// previously declared here is no longer needed.

function LocalFallbackBot() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState([
    { role: "assistant", text: "Hi! CopilotKit key is missing, so you're chatting with the local C# starter bot." }
  ]);
  const [loading, setLoading] = React.useState(false);

  async function onSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendLocalMessage(trimmed);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I couldn't reach the local agent endpoint." }]);
    } finally {
      setLoading(false);
    }
  }

  return e(
    React.Fragment,
    null,
    e(
      "button",
      { className: "fallback-trigger", onClick: () => setOpen((v) => !v), type: "button" },
      open ? "×" : "Chat"
    ),
    open &&
      e(
        "section",
        { className: "fallback-panel" },
        e("h3", null, "Floating Bot (Local Fallback)"),
        e(
          "div",
          { className: "fallback-messages" },
          messages.map((message, index) => e("p", { key: `${message.role}-${index}`, className: `msg-${message.role}` }, message.text))
        ),
        e(
          "div",
          { className: "fallback-input" },
          e("input", {
            value: input,
            onChange: (event) => setInput(event.target.value),
            onKeyDown: (event) => { if (event.key === "Enter") onSend(); },
            placeholder: "Ask about weather..."
          }),
          e("button", { onClick: onSend, disabled: loading, type: "button" }, loading ? "..." : "Send")
        )
      )
  );
}

async function bootstrap() {
  try {
    const publicApiKey = HARDCODED_PUBLIC_KEY;
    if (!publicApiKey) {
      createRoot(document.getElementById("root")).render(e(LocalFallbackBot));
      return;
    }

    // Try to dynamically load CopilotKit modules. Some CDN bundles (esm.sh)
    // may try to import CSS as JS modules (causing MIME errors). If loading
    // the CopilotKit modules fails, fall back to the local bot UI instead of
    // letting the page crash.
    try {
      const core = await import("https://esm.sh/@copilotkit/react-core?bundle");
      const ui = await import("https://esm.sh/@copilotkit/react-ui?bundle");

      const CopilotKit = core.CopilotKit ?? core.default;
      const CopilotPopup = ui.CopilotPopup ?? ui.default;

      // Use the provided CopilotKit public API key directly in the JSX-like wrapper
      const copilotProps = { publicApiKey: "ck_pub_15254ec35f90794301e47df2e9b56366", agent: "starter" };

      createRoot(document.getElementById("root")).render(
        e(CopilotKit, copilotProps, e(CopilotPopup, {
          labels: { title: "Floating Bot", initial: "Hi! I am your CopilotKit bot." },
          instructions: "You are a helpful assistant for this .NET app. Keep replies concise and friendly.",
          defaultOpen: false,
          clickOutsideToClose: true
        }))
      );
    } catch (err) {
      // If dynamic import fails (MIME or network error), show local fallback
      console.warn("CopilotKit modules failed to load, using local fallback.", err);
      createRoot(document.getElementById("root")).render(e(LocalFallbackBot));
    }
  } catch (error) {
    document.getElementById("root").innerHTML = `<p style="color:#fca5a5">${error.message}</p>`;
  }
}

bootstrap();

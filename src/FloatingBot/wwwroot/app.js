import React from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import { CopilotKit } from "https://esm.sh/@copilotkit/react-core";
import { CopilotPopup } from "https://esm.sh/@copilotkit/react-ui";
import "https://esm.sh/@copilotkit/react-ui/styles.css";

const e = React.createElement;

async function loadCopilotConfig() {
  const response = await fetch("/api/copilotkit/config");
  if (!response.ok) {
    throw new Error("Unable to load CopilotKit configuration.");
  }

  return response.json();
}

async function sendLocalMessage(message) {
  const response = await fetch("/api/agent/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error("Local agent failed to respond.");
  }

  const payload = await response.json();
  return payload.message;
}

function App({ config }) {
  const copilotProps = {
    publicApiKey: config.publicApiKey,
    agent: config.agent || "starter"
  };

  return e(
    CopilotKit,
    copilotProps,
    e(CopilotPopup, {
      labels: {
        title: "Floating Bot",
        initial: "Hi! I am your CopilotKit bot."
      },
      instructions:
        "You are a helpful assistant for this .NET app. Keep replies concise and friendly.",
      defaultOpen: false,
      clickOutsideToClose: true
    })
  );
}

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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't reach the local agent endpoint." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return e(
    React.Fragment,
    null,
    e(
      "button",
      {
        className: "fallback-trigger",
        onClick: () => setOpen((value) => !value),
        type: "button"
      },
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
          messages.map((message, index) =>
            e(
              "p",
              { key: `${message.role}-${index}`, className: `msg-${message.role}` },
              message.text
            )
          )
        ),
        e(
          "div",
          { className: "fallback-input" },
          e("input", {
            value: input,
            onChange: (event) => setInput(event.target.value),
            onKeyDown: (event) => {
              if (event.key === "Enter") onSend();
            },
            placeholder: "Ask about weather..."
          }),
          e(
            "button",
            { onClick: onSend, disabled: loading, type: "button" },
            loading ? "..." : "Send"
          )
        )
      )
  );
}

async function bootstrap() {
  try {
    const config = await loadCopilotConfig();

    if (!config.publicApiKey) {
      createRoot(document.getElementById("root")).render(e(LocalFallbackBot));
      return;
    }

    createRoot(document.getElementById("root")).render(e(App, { config }));
  } catch (error) {
    document.getElementById("root").innerHTML = `<p style="color:#fca5a5">${error.message}</p>`;
  }
}

bootstrap();

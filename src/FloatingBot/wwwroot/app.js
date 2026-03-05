import React from "https://esm.sh/react@18.3.1?bundle";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client?bundle";
import { CopilotKit } from "https://esm.sh/@copilotkit/react-core?bundle";
import { CopilotPopup } from "https://esm.sh/@copilotkit/react-ui?bundle";

const e = React.createElement;

async function loadCopilotConfig() {
  const response = await fetch("/api/copilotkit/config");
  if (!response.ok) {
    throw new Error("Unable to load CopilotKit configuration.");
  }

  return response.json();
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

async function bootstrap() {
  try {
    const config = await loadCopilotConfig();

    if (!config.publicApiKey) {
      document.getElementById("root").innerHTML = `
        <button class="fallback-trigger" type="button" aria-label="Open chat">Chat</button>
        <div class="fallback-tip">Set <code>COPILOTKIT_PUBLIC_API_KEY</code> to enable CopilotKit popup.</div>`;
      return;
    }

    createRoot(document.getElementById("root")).render(e(App, { config }));
  } catch (error) {
    document.getElementById("root").innerHTML = `<p style="color:#fca5a5">${error.message}</p>`;
  }
}

bootstrap();

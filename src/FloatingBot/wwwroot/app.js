import React from "https://esm.sh/react@18.3.1?bundle";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client?bundle";
import { CopilotKit } from "https://esm.sh/@copilotkit/react-core?bundle";
import { CopilotPopup } from "https://esm.sh/@copilotkit/react-ui?bundle";

const e = React.createElement;

const DEFAULT_CONFIG = {
  publicApiKey: "ck_pub_3e541a2adcc6601e866f513c690961b1",
  agent: "starter"
};

async function loadCopilotConfig() {
  try {
    const response = await fetch("/api/copilotkit/config");
    if (!response.ok) {
      return DEFAULT_CONFIG;
    }

    const data = await response.json();

    return {
      publicApiKey: data.publicApiKey || DEFAULT_CONFIG.publicApiKey,
      agent: data.agent || DEFAULT_CONFIG.agent
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function App({ config }) {
  return e(
    CopilotKit,
    {
      publicApiKey: config.publicApiKey,
      agent: config.agent
    },
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
  const config = await loadCopilotConfig();
  createRoot(document.getElementById("root")).render(e(App, { config }));
}

bootstrap();

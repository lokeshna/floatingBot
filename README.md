# Floating Bot (.NET + CopilotKit)

This repository contains a starter `.NET 8` web app in C# with:

- A **floating CopilotKit chat UI** (`CopilotPopup`) when CopilotKit cloud config is present.
- A **local floating fallback bot** that talks to a C# endpoint when CopilotKit key is not set.
- A sample C# chat endpoint (`/api/agent/chat`) for local starter logic.

## Project structure

- `src/FloatingBot/Program.cs` — ASP.NET Core host + API endpoints.
- `src/FloatingBot/Services/WeatherAgentService.cs` — starter C# agent behavior.
- `src/FloatingBot/wwwroot/app.js` — CopilotKit + local fallback floating bot UI.

## Run locally

1. Install .NET 8 SDK.
2. Optional CopilotKit cloud values:

   ```bash
   export COPILOTKIT_PUBLIC_API_KEY="your_public_key"
   export COPILOTKIT_AGENT="starter"
   ```

3. Run the app:

   ```bash
   dotnet run --project src/FloatingBot/FloatingBot.csproj
   ```

4. Open the local URL shown in output.

If `COPILOTKIT_PUBLIC_API_KEY` is missing, the app automatically uses a local fallback floating bot so chat still works during development.

## Push to GitHub

```bash
git remote add origin https://github.com/lokeshna/floatingBot.git
git push -u origin work
```

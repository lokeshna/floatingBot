# Floating Bot (.NET + CopilotKit)

This repository contains a starter `.NET 8` web app in C# with a CopilotKit floating popup.

## Run locally

1. Install .NET 8 SDK.
2. (Optional) Override CopilotKit values:

   ```bash
   export COPILOTKIT_PUBLIC_API_KEY="your_public_key"
   export COPILOTKIT_AGENT="starter"
   ```

3. Run the app:

   ```bash
   dotnet run --project src/FloatingBot/FloatingBot.csproj
   ```

4. Open the local URL shown in output.

## CopilotKit key behavior

- The frontend is configured with a default public key so the floating popup appears immediately.
- If `/api/copilotkit/config` is available, the app uses server-provided values (env vars) and falls back to the default key only when missing.

## Push to GitHub

```bash
git push -u origin work
```

using FloatingBot.Models;
using FloatingBot.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<WeatherAgentService>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/api/agent/chat", async (ChatRequest request, WeatherAgentService agentService) =>
{
    if (string.IsNullOrWhiteSpace(request.Message))
    {
        return Results.BadRequest(new { error = "Message is required." });
    }

    var response = await agentService.GetResponseAsync(request.Message);
    return Results.Ok(new ChatResponse(response));
});

app.MapGet("/api/copilotkit/config", () =>
{
    const string defaultPublicApiKey = "ck_pub_3e541a2adcc6601e866f513c690961b1";

    var publicApiKey = Environment.GetEnvironmentVariable("COPILOTKIT_PUBLIC_API_KEY") ?? defaultPublicApiKey;
    var agent = Environment.GetEnvironmentVariable("COPILOTKIT_AGENT") ?? "starter";

    return Results.Ok(new CopilotKitConfigResponse(publicApiKey, agent));
});

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();

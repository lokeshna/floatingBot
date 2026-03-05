namespace FloatingBot.Services;

public sealed class WeatherAgentService
{
    public Task<string> GetResponseAsync(string userMessage)
    {
        var lower = userMessage.ToLowerInvariant();

        if (lower.Contains("weather"))
        {
            return Task.FromResult("It is 72°F and sunny in Seattle. (Sample starter response from your C# agent)");
        }

        return Task.FromResult(
            "I am your CopilotKit floating bot hosted by ASP.NET Core. Ask me about the weather to see starter behavior.");
    }
}

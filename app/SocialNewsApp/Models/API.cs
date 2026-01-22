using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace SocialNewsApp.Models;

public class API
{
    JsonSerializerOptions jsonOptions = new() { PropertyNameCaseInsensitive = true };
    HttpClient http;
    string? token;
    public async Task<List<Post>> GetPosts()
    {
        HttpResponseMessage result = await http.GetAsync("posts");
        string body = await result.Content.ReadAsStringAsync();

        return JsonSerializer.Deserialize<List<Post>>(body, jsonOptions);

    }
    public API(string baseAddress)
    {
        http = new() { BaseAddress = new Uri(baseAddress) };
    }
}

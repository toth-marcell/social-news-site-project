using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace SocialNewsApp.Models;

public class API
{
    JsonSerializerOptions jsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    HttpClient http;
    string? token;
    public bool IsLoggedIn => token != null;
    public void Logout() => token = null;
    public async Task<string> Login(NamePassword namePassword)
    {
        HttpResponseMessage result = await http.PostAsJsonAsync("login", namePassword, jsonOptions);
        MessageWithToken response = await result.Content.ReadFromJsonAsync<MessageWithToken>(jsonOptions);
        if (result.IsSuccessStatusCode)
        {
            token = response.Token;
            return response.Msg;
        }
        else throw new Exception(response.Msg);
    }
    public async Task<string> Register(NamePassword namePassword)
    {
        HttpResponseMessage result = await http.PostAsJsonAsync("register", namePassword, jsonOptions);
        Message response = await result.Content.ReadFromJsonAsync<Message>(jsonOptions);
        if (result.IsSuccessStatusCode) return response.Msg;
        else throw new Exception(response.Msg);
    }
    public async Task<List<Post>> GetPosts()
    {
        return await http.GetFromJsonAsync<List<Post>>("posts", jsonOptions);
    }
    public API(string baseAddress)
    {
        http = new() { BaseAddress = new Uri(baseAddress) };
    }
}

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace SocialNewsApp.Models;

public class API
{
    readonly JsonSerializerOptions jsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    readonly HttpClient http;
    string? token;
    string? Token
    {
        get => token;
        set
        {
            token = value;
            if (value == null) http.DefaultRequestHeaders.Authorization = null;
            else http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", value);
        }
    }
    public bool IsLoggedIn => Token != null;
    public void Logout() => Token = null;
    public async Task<string> Login(NamePassword namePassword)
    {
        HttpResponseMessage result = await http.PostAsJsonAsync("login", namePassword, jsonOptions);
        MessageWithToken response = await result.Content.ReadFromJsonAsync<MessageWithToken>(jsonOptions);
        if (result.IsSuccessStatusCode)
        {
            Token = response.Token;
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
    public async Task<string> SubmitPost(PostContents post)
    {
        HttpResponseMessage result = await http.PostAsJsonAsync("posts", post, jsonOptions);
        Message response = await result.Content.ReadFromJsonAsync<Message>(jsonOptions);
        if (result.IsSuccessStatusCode) return response.Msg;
        else throw new Exception(response.Msg);
    }
    public API(string baseAddress)
    {
        http = new() { BaseAddress = new Uri(baseAddress) };
    }
}

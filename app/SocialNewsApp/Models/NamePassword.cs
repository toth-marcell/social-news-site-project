namespace SocialNewsApp.Models;

public class NamePassword(string name, string password)
{
    public string Name { get; set; } = name;
    public string Password { get; set; } = password;
}

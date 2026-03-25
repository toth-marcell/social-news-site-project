using CommunityToolkit.Mvvm.ComponentModel;
using System;
using Jdenticon;
namespace SocialNewsApp.Models;

public partial class UserName : ObservableObject
{
    [ObservableProperty]
    string name;
    public string Identicon => Jdenticon.Identicon.FromValue(Name, 25).ToSvg();
    static UserName()
    {
        Jdenticon.Identicon.DefaultStyle = new()
        {
            BackColor = Jdenticon.Rendering.Color.Transparent
        };
    }
}

public partial class User : UserName
{
    [ObservableProperty]
    int id;
    [ObservableProperty]
    string about;
    [ObservableProperty]
    bool isAdmin;
    [ObservableProperty]
    DateTimeOffset createdAt;
    [ObservableProperty]
    DateTimeOffset updatedAt;
    [ObservableProperty]
    int points;
}
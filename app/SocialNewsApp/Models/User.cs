using CommunityToolkit.Mvvm.ComponentModel;
using System;

namespace SocialNewsApp.Models;

public partial class UserName : ObservableObject
{
    [ObservableProperty]
    string name;
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
}
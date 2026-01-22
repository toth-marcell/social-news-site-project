using System;
using CommunityToolkit.Mvvm.ComponentModel;

namespace SocialNewsApp.Models
{
    public partial class Post : ObservableObject
    {
        [ObservableProperty]
        int id;
        [ObservableProperty]
        string title;
        [ObservableProperty]
        string link;
        [ObservableProperty]
        string linkType;
        [ObservableProperty]
        string text;
        [ObservableProperty]
        string category;
        [ObservableProperty]
        DateTimeOffset createdAt;
        [ObservableProperty]
        DateTimeOffset updatedAt;
        [ObservableProperty]
        int userId;
        [ObservableProperty]
        UserName user;
        [ObservableProperty]
        int votes;
        [ObservableProperty]
        bool? voted;
    }
    public partial class UserName : ObservableObject
    {
        [ObservableProperty]
        string name;
    }
}

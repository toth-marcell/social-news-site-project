using System;
using CommunityToolkit.Mvvm.ComponentModel;

namespace SocialNewsApp.Models
{
    public partial class PostContents : ObservableObject
    {
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
        public PostContents(string title, string link, string linkType, string text, string category)
        {
            Title = title;
            Link = link;
            LinkType = linkType;
            Text = text;
            Category = category;
        }
        public PostContents() { }
    }
    public partial class Post : PostContents
    {
        [ObservableProperty]
        int id;
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
        bool voted = false;
    }
    public partial class UserName : ObservableObject
    {
        [ObservableProperty]
        string name;
    }
}

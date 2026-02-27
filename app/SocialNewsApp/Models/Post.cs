using System;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace SocialNewsApp.Models;

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
public partial class UserName : ObservableObject
{
    [ObservableProperty]
    string name;
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
    public RelayCommand<int> DetailsCommand { get; set; }
    public Post(string title, string link, string linkType, string text, string category, int id, DateTimeOffset createdAt, DateTimeOffset updatedAt, int userId, UserName user, int votes, bool voted) : base(title, link, linkType, text, category)
    {
        Id = id;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        UserId = userId;
        User = user;
        Votes = votes;
        Voted = voted;
    }
    public Post() { }
}
public partial class Comment : ObservableObject
{
    [ObservableProperty]
    int id;
    [ObservableProperty]
    string text;
    [ObservableProperty]
    DateTimeOffset createdAt;
    [ObservableProperty]
    DateTimeOffset updatedAt;
    [ObservableProperty]
    int userId;
    [ObservableProperty]
    int postId;
    [ObservableProperty]
    int parentId;
    [ObservableProperty]
    UserName user;
    [ObservableProperty]
    Comment[] children;
    [ObservableProperty]
    int votes;
    [ObservableProperty]
    bool voted = false;
}
public partial class PostWithComments : Post
{
    [ObservableProperty]
    Comment[] comments;
}

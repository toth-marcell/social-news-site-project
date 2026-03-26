using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Linq;

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
    [ObservableProperty]
    RelayCommand? detailsCommand;
    [ObservableProperty]
    RelayCommand? upvoteCommand;
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
public partial class PostWithComments : Post
{
    public string? Paragraphs => Text == null ? null : string.Join("\n", Text.Split("\r\n\r\n").Select(x => x.Replace("\r\n", " ")));
    [ObservableProperty]
    Comment[] comments;
    [ObservableProperty]
    RelayCommand<string>? submitCommentCommand;
    [ObservableProperty]
    string commentField;
    [ObservableProperty]
    RelayCommand? deleteCommand;
    [ObservableProperty]
    RelayCommand? editCommand;
}

using System;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace SocialNewsApp.Models;

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
    int? parentId;
    [ObservableProperty]
    UserName user;
    [ObservableProperty]
    Comment[] children;
    [ObservableProperty]
    int votes;
    [ObservableProperty]
    bool voted = false;
    [ObservableProperty]
    RelayCommand? upvoteCommand;
    [ObservableProperty]
    RelayCommand<string>? submitReplyCommand;
    [ObservableProperty]
    string replyField;
    [ObservableProperty]
    bool isReplyFieldShown = false;
    [ObservableProperty]
    RelayCommand? deleteCommand;
    [ObservableProperty]
    RelayCommand<string>? editCommand;
    [ObservableProperty]
    bool isEditing = false;
    [ObservableProperty]
    string newText;
}

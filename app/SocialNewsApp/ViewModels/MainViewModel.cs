using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MsBox.Avalonia;
using SocialNewsApp.Models;
using System;

namespace SocialNewsApp.ViewModels;

public partial class MainViewModel : ViewModelBase
{
    public MainViewModel()
    {
        // Main page
        RefreshPostsCommand = new(() => RefreshPosts());
        ChangeSortCommand = new(sort => PostSort = sort);
        NextPageCommand = new(() =>
        {
            RefreshPosts(CurrentPage.Offset + CurrentPage.Limit);
        });
        LogInOrRegisterCommand = new(() => { ActivePage = MainViewPage.LoginOrRegister; });
        NewPostCommand = new(() =>
        {
            ActivePage = MainViewPage.PostEditor;
            PostEditorViewModel = new(new(async () =>
            {
                try
                {
                    ShowMessage("Success!", await API.SubmitPost(PostEditorViewModel.GetPost()));
                    ActivePage = MainViewPage.Main;
                    RefreshPosts();
                }
                catch (Exception e)
                {
                    ShowMessage("Error", e.Message);
                }
            }));

        });
        LogOutCommand = new(() => { API.Logout(); OnPropertyChanged(nameof(IsLoggedIn)); CurrentUser = null; RefreshPosts(); });
        // Login or register page
        LogInCommand = new(async () =>
        {
            try
            {
                ShowMessage("Success!", await API.Login(new(Name, Password)));
                OnPropertyChanged(nameof(IsLoggedIn));
                ActivePage = MainViewPage.Main;
                RefreshPosts();
            }
            catch (Exception e)
            {
                ShowMessage("Error", e.Message);
            }
        });
        RegisterCommand = new(async () =>
        {
            try
            {
                ShowMessage("Success!", await API.Register(new(Name, Password)));
                ActivePage = MainViewPage.LoginOrRegister;
            }
            catch (Exception e)
            {
                ShowMessage("Error", e.Message);
            }
        });
        // Shared
        BackCommand = new(() => { ActivePage = BackDestination; BackDestination = MainViewPage.Main; });
        RefreshPosts();
    }
    // Pages
    public enum MainViewPage
    {
        Main,
        PostDetails,
        LoginOrRegister,
        PostEditor,
    }
    MainViewPage activePage = MainViewPage.Main;
    MainViewPage ActivePage
    {
        get => activePage;
        set
        {
            if (activePage != value)
            {
                activePage = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(IsMainActive));
                OnPropertyChanged(nameof(IsLoginOrRegisterActive));
                OnPropertyChanged(nameof(IsPostEditorActive));
                OnPropertyChanged(nameof(IsPostDetailsActive));
            }
        }
    }
    public bool IsMainActive => ActivePage == MainViewPage.Main;
    public bool IsLoginOrRegisterActive => ActivePage == MainViewPage.LoginOrRegister;
    public bool IsPostEditorActive => ActivePage == MainViewPage.PostEditor;
    public bool IsPostDetailsActive => ActivePage == MainViewPage.PostDetails;
    // Main page
    [ObservableProperty]
    PostPage currentPage;
    readonly API API = new("http://localhost:3000/api/");
    public RelayCommand RefreshPostsCommand { get; set; }
    string postSort = "hot";
    public string PostSort
    {
        get => postSort;
        set
        {
            postSort = value;
            OnPropertyChanged();
            RefreshPosts();
        }
    }
    public RelayCommand<string> ChangeSortCommand { get; set; }
    public RelayCommand NextPageCommand { get; set; }
    public RelayCommand LogInOrRegisterCommand { get; set; }
    public RelayCommand LogOutCommand { get; set; }
    public RelayCommand NewPostCommand { get; set; }
    private async void RefreshPosts(int offset = 0)
    {
        try
        {
            try
            {
                CurrentUser = await API.GetCurrentUser();
            }
            catch (Exception e)
            {
                CurrentUser = null;
                OnPropertyChanged(nameof(IsLoggedIn));
                ShowMessage("Error", e.Message);
            }
            switch (PostSort)
            {
                case "hot":
                    CurrentPage = await API.GetHotPostPage(offset);
                    break;
                case "new":
                    CurrentPage = await API.GetNewPostPage(offset);
                    break;
            }
            foreach (Post post in CurrentPage.Posts)
            {
                post.DetailsCommand = new(() => ShowPostDetails(post));
                post.UpvoteCommand = IsLoggedIn ? new(() => UpvotePost(post)) : null;
            }
        }
        catch (Exception e)
        {
            ShowMessage("Error", e.Message);
        }
    }
    private void ApplyCommandsToComments(Comment comment)
    {
        if (IsLoggedIn)
        {
            comment.UpvoteCommand = new(() => UpvoteComment(comment));
            comment.SubmitReplyCommand = new(async (text) =>
            {
                try
                {
                    await API.ChildComment(comment.Id, text);
                    ShowPostDetails(OpenPost);
                }
                catch (Exception e)
                {
                    ShowMessage("Error", e.Message);
                }
            });
            if (CurrentUser!.IsAdmin || CurrentUser.Id == comment.UserId)
            {
                comment.DeleteCommand = new(async () =>
                {
                    try
                    {
                        ShowMessage("Success!", await API.DeleteComment(comment.Id));
                        ShowPostDetails(OpenPost);
                    }
                    catch (Exception e)
                    {
                        ShowMessage("Error", e.Message);
                    }
                });
            }
            comment.EditCommand = new(async (text) =>
            {
                try
                {
                    ShowMessage("Success!", await API.EditComment(comment.Id, text!));
                    ShowPostDetails(OpenPost);
                }
                catch (Exception e)
                {
                    ShowMessage("Error", e.Message);
                }
            });
            comment.NewText = comment.Text;
        }
        foreach (Comment child in comment.Children) ApplyCommandsToComments(child);
    }
    private async void ShowPostDetails(Post post)
    {
        try
        {
            OpenPost = await API.GetPostDetails(post.Id);
            if (IsLoggedIn)
            {
                OpenPost.UpvoteCommand = new(() => UpvotePost(OpenPost));
                OpenPost.SubmitCommentCommand = new(async (text) =>
                {
                    try
                    {
                        await API.TopComment(OpenPost.Id, text);
                        ShowPostDetails(OpenPost);
                    }
                    catch (Exception e)
                    {
                        ShowMessage("Error", e.Message);
                    }
                });
                if (CurrentUser!.IsAdmin || CurrentUser.Id == OpenPost.UserId)
                {
                    OpenPost.DeleteCommand = new(async () =>
                    {
                        try
                        {
                            ShowMessage("Success!", await API.DeletePost(OpenPost.Id));
                            ActivePage = MainViewPage.Main;
                            RefreshPosts();
                        }
                        catch (Exception e)
                        {
                            ShowMessage("Error", e.Message);
                        }
                    });
                    OpenPost.EditCommand = new(() =>
                    {
                        PostEditorViewModel = new(OpenPost, new(async () =>
                        {
                            try
                            {
                                ShowMessage("Success!", await API.EditPost(OpenPost.Id, PostEditorViewModel.GetPost()));
                                ShowPostDetails(OpenPost);
                            }
                            catch (Exception e)
                            {
                                ShowMessage("Error", e.Message);
                            }
                        }));
                        ActivePage = MainViewPage.PostEditor;
                        BackDestination = MainViewPage.PostDetails;
                    });
                }
            }
            foreach (Comment comment in OpenPost.Comments) ApplyCommandsToComments(comment);
            ActivePage = MainViewPage.PostDetails;
        }
        catch (Exception e)
        {
            ShowMessage("Error", e.Message);
        }
    }
    private async void UpvotePost(Post post)
    {
        try
        {
            await API.UpvotePost(post.Id);
            if (post.Voted)
            {
                post.Voted = false;
                post.Votes--;
            }
            else
            {
                post.Voted = true;
                post.Votes++;
            }
        }
        catch (Exception e)
        {
            ShowMessage("Error", e.Message);
        }
    }
    private async void UpvoteComment(Comment comment)
    {
        try
        {
            await API.UpvoteComment(comment.Id);
            if (comment.Voted)
            {
                comment.Voted = false;
                comment.Votes--;
            }
            else
            {
                comment.Voted = true;
                comment.Votes++;
            }
        }
        catch (Exception e)
        {
            ShowMessage("Error", e.Message);
        }
    }
    // Post details page
    [ObservableProperty]
    PostWithComments openPost;
    // Login or register page
    [ObservableProperty]
    string name;
    [ObservableProperty]
    string password;
    public RelayCommand LogInCommand { get; set; }
    public RelayCommand RegisterCommand { get; set; }
    // Post editor 
    [ObservableProperty]
    PostEditorViewModel postEditorViewModel;
    // Shared
    public RelayCommand BackCommand { get; set; }
    [ObservableProperty]
    MainViewPage backDestination = MainViewPage.Main;
    public bool IsLoggedIn => API.IsLoggedIn;
    [ObservableProperty]
    User? currentUser;
    static void ShowMessage(string title, string message)
    {
        var messageBox = MessageBoxManager.GetMessageBoxCustom(new()
        {
            ContentTitle = title,
            ContentMessage = message,
            ButtonDefinitions = [new() { Name = "Ok" }],
            MinHeight = 150,
            MinWidth = 300,
            WindowStartupLocation = WindowStartupLocation.CenterOwner
        });
        if (Application.Current!.ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            messageBox.ShowWindowDialogAsync(desktop.MainWindow!);
        }
        else if (Application.Current.ApplicationLifetime is ISingleViewApplicationLifetime singleViewPlatform)
        {
            messageBox.ShowAsPopupAsync(TopLevel.GetTopLevel(singleViewPlatform.MainView)!);
        }
    }
}

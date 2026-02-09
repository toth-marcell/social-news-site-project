using System;
using System.Collections.ObjectModel;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MsBox.Avalonia;
using SocialNewsApp.Models;

namespace SocialNewsApp.ViewModels;

public partial class MainViewModel : ViewModelBase
{
    public MainViewModel()
    {
        // Main page
        RefreshPostsCommand = new(RefreshPosts);
        LogInOrRegisterCommand = new(() => { ActivePage = MainViewPage.LoginOrRegister; });
        NewPostCommand = new(() => { ActivePage = MainViewPage.NewPost; });
        LogOutCommand = new(() => { API.Logout(); OnPropertyChanged(nameof(IsLoggedIn)); RefreshPosts(); });
        // Login or register page
        LogInCommand = new(async () =>
        {
            try
            {
                ShowMessage("Success!", await API.Login(new(Name, Password)));
                OnPropertyChanged(nameof(IsLoggedIn));
                ActivePage = MainViewPage.Main;
                ClearAllForms();
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
                ClearAllForms();
            }
            catch (Exception e)
            {
                ShowMessage("Error", e.Message);
            }
        });
        //New post page
        SubmitNewPostCommand = new(async () =>
        {
            try
            {
                ShowMessage("Success!", await API.SubmitPost(new(Title, Link, LinkType, Text, Category)));
                ActivePage = MainViewPage.Main;
                ClearAllForms();
                RefreshPosts();
            }
            catch (Exception e)
            {
                ShowMessage("Error", e.Message);
            }
        });
        // Shared
        CancelCommand = new(() => { ActivePage = MainViewPage.Main; ClearAllForms(); });
        RefreshPosts();
    }
    // Pages
    enum MainViewPage
    {
        Main,
        PostDetails,
        LoginOrRegister,
        NewPost
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
                OnPropertyChanged(nameof(IsNewPostActive));
                OnPropertyChanged(nameof(IsPostDetailsActive));
            }
        }
    }
    public bool IsMainActive => ActivePage == MainViewPage.Main;
    public bool IsLoginOrRegisterActive => ActivePage == MainViewPage.LoginOrRegister;
    public bool IsNewPostActive => ActivePage == MainViewPage.NewPost;
    public bool IsPostDetailsActive => ActivePage == MainViewPage.PostDetails;
    // Main page
    public ObservableCollection<Post> Posts { get; set; } = [];
    readonly API API = new("http://localhost:3000/api/");
    public RelayCommand RefreshPostsCommand { get; set; }
    public RelayCommand LogInOrRegisterCommand { get; set; }
    public RelayCommand LogOutCommand { get; set; }
    public RelayCommand NewPostCommand { get; set; }
    async void RefreshPosts()
    {
        try
        {
            Posts = [.. await API.GetPosts()];
            OnPropertyChanged(nameof(Posts));
        }
        catch (Exception e)
        {
            ShowMessage("Error", e.Message);
        }
    }
    //Post details page
    [ObservableProperty]
    Post openPost;
    // Login or register page
    [ObservableProperty]
    string name;
    [ObservableProperty]
    string password;
    public RelayCommand LogInCommand { get; set; }
    public RelayCommand RegisterCommand { get; set; }
    //New post page
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
    public RelayCommand SubmitNewPostCommand { get; set; }
    // Shared
    public RelayCommand CancelCommand { get; set; }
    public bool IsLoggedIn => API.IsLoggedIn;
    void ClearAllForms()
    {
        Name = "";
        Password = "";
        Title = "";
        Link = "";
        LinkType = "";
        Text = "";
        Category = "";
    }
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

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
        // Main Page
        RefreshPostsCommand = new(RefreshPosts);
        LogInOrRegisterCommand = new(() => { ActivePage = MainViewPage.LoginOrRegister; });
        LogOutCommand = new(() => { API.Logout(); OnPropertyChanged(nameof(IsLoggedIn)); });
        // Login or register page
        LogInCommand = new(async () =>
        {
            try
            {
                ShowMessage("Success!", await API.Login(new(Name, Password)));
                OnPropertyChanged(nameof(IsLoggedIn));
                ActivePage = MainViewPage.Main;
                ClearAllForms();
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
        // Shared
        CancelCommand = new(() => { ActivePage = MainViewPage.Main; ClearAllForms(); });
        RefreshPosts();
    }
    // Pages
    enum MainViewPage
    {
        Main,
        LoginOrRegister
    }
    MainViewPage activePage = MainViewPage.LoginOrRegister;
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
            }
        }
    }
    public bool IsMainActive => ActivePage == MainViewPage.Main;
    public bool IsLoginOrRegisterActive => ActivePage == MainViewPage.LoginOrRegister;
    // Main Page
    public ObservableCollection<Post> Posts { get; set; } = [];
    readonly API API = new("http://localhost:3000/api/");
    public RelayCommand RefreshPostsCommand { get; set; }
    public RelayCommand LogInOrRegisterCommand { get; set; }
    public RelayCommand LogOutCommand { get; set; }
    async void RefreshPosts()
    {
        Posts = [.. await API.GetPosts()];
        OnPropertyChanged(nameof(Posts));
    }
    // Login or register page
    [ObservableProperty]
    string name;
    [ObservableProperty]
    string password;
    public RelayCommand LogInCommand { get; set; }
    public RelayCommand RegisterCommand { get; set; }
    // Shared
    public RelayCommand CancelCommand { get; set; }
    public bool IsLoggedIn => API.IsLoggedIn;
    void ClearAllForms()
    {
        Name = "";
        Password = "";
    }
    void ShowMessage(string title, string message)
    {
        var messageBox = MessageBoxManager.GetMessageBoxCustom(new()
        {
            ContentTitle = title,
            ContentMessage = message,
            ButtonDefinitions = [new() { Name = "Ok" }],
            MinHeight = 150,
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

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Avalonia.Controls;
using CommunityToolkit.Mvvm.Input;
using SocialNewsApp.Models;

namespace SocialNewsApp.ViewModels;

public partial class MainViewModel : ViewModelBase
{
    public ObservableCollection<Post> Posts { get; set; } = [];
    API API = new("http://localhost:3000/api/");
    public RelayCommand RefreshPostsCommand { get; set; }
    public RelayCommand LogInOrRegisterCommand { get; set; }
    public bool IsLoggedIn => API.IsLoggedIn;
    public string Name { get; set; }
    public string Password { get; set; }

    enum MainViewPage
    {
        Main,
        LoginOrRegister
    }
    MainViewPage activePage;
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
    public RelayCommand CancelCommand { get; set; }
    public MainViewModel()
    {
        RefreshPostsCommand = new(RefreshPosts);
        LogInOrRegisterCommand = new(() => { ActivePage = MainViewPage.LoginOrRegister; });
        CancelCommand = new(() => { ActivePage = MainViewPage.Main; ClearAllForms(); });
        RefreshPosts();
    }
    async void RefreshPosts()
    {
        Posts = [.. await API.GetPosts()];
        OnPropertyChanged(nameof(Posts));
    }
    void ClearAllForms()
    {
        Name = "";
        Password = "";
    }
}

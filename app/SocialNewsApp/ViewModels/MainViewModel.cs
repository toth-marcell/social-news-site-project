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
    public Action<UserControl> ShowDialog;
    public MainViewModel()
    {
        RefreshPostsCommand = new(RefreshPosts);
        LogInOrRegisterCommand = new(() =>
        {
            ShowDialog(new LogInOrRegisterView());
        });
        RefreshPosts();
    }
    async void RefreshPosts()
    {
        Posts = [.. await API.GetPosts()];
        OnPropertyChanged(nameof(Posts));
    }
}

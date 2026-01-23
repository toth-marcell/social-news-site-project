using System.Collections.Generic;
using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.Input;
using SocialNewsApp.Models;

namespace SocialNewsApp.ViewModels;

public partial class MainViewModel : ViewModelBase
{
    public ObservableCollection<Post> Posts { get; set; } = [];
    API API = new("http://localhost:3000/api/");
    public RelayCommand RefreshPostsCommand { get; set; }
    public MainViewModel()
    {
        RefreshPostsCommand = new(RefreshPosts);
        RefreshPosts();
    }
    async void RefreshPosts()
    {
        Posts = [.. await API.GetPosts()];
        OnPropertyChanged(nameof(Posts));
    }
}

using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.Input;
using SocialNewsApp.Models;

namespace SocialNewsApp.ViewModels;

public partial class MainViewModel : ViewModelBase
{
    ObservableCollection<Post> Posts { get; set; } = [];
    API API = new("http://localhost:3000/api/");
    public RelayCommand RefreshPostsCommand { get; set; }
    public MainViewModel()
    {
        RefreshPostsCommand = new(RefreshPosts);
        RefreshPosts();
    }
    async void RefreshPosts()
    {
        foreach (Post post in await API.GetPosts()) Posts.Add(post);
        OnPropertyChanged(nameof(Posts));
    }
}

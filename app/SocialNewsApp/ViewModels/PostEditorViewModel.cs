using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using SocialNewsApp.Models;

namespace SocialNewsApp.ViewModels
{
    public partial class PostEditorViewModel : ObservableObject
    {
        [ObservableProperty]
        string title = "";
        [ObservableProperty]
        string link = "";
        [ObservableProperty]
        string linkType = "";
        [ObservableProperty]
        string text = "";
        [ObservableProperty]
        string category = "";
        [ObservableProperty]
        RelayCommand submitCommand;
        [ObservableProperty]
        string formTitle;
        public PostContents GetPost() => new(Title, Link, LinkType, Text, Category);

        public PostEditorViewModel(Post post, RelayCommand submitCommand)
        {
            Title = post.Title;
            Link = post.Link;
            LinkType = post.LinkType;
            Text = post.Text;
            Category = post.Category;
            SubmitCommand = submitCommand;
            FormTitle = $"Editing post by {post.User.Name} with id {post.Id}";
        }
        public PostEditorViewModel(RelayCommand submitCommand)
        {
            SubmitCommand = submitCommand;
            FormTitle = "New post";
        }
        public PostEditorViewModel() { }
    }
}

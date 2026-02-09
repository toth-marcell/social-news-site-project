using CommunityToolkit.Mvvm.Input;
using SocialNewsApp.Models;

namespace SocialNewsApp.ViewModels;

public class PostWithDetailsCommand(Post post, RelayCommand<int> detailsCommand) : Post(post.Title, post.Link, post.LinkType, post.Text, post.Category, post.Id, post.CreatedAt, post.UpdatedAt, post.UserId, post.User, post.Votes, post.Voted)
{
    public RelayCommand<int> DetailsCommand { get; set; } = detailsCommand;
}

using Avalonia.Controls;
using Avalonia.Input;
using SocialNewsApp.Models;

namespace SocialNewsApp.Views;

public partial class PostControl : UserControl
{
    public PostControl()
    {
        InitializeComponent();
    }

    private void Grid_PointerReleased(object? sender, PointerReleasedEventArgs e)
    {
        Post post = (DataContext as Post)!;
        post.DetailsCommand.Execute(post.Id);
    }
}
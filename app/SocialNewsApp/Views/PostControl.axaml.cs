using Avalonia.Controls;
using Avalonia.Input;
using SocialNewsApp.ViewModels;

namespace SocialNewsApp.Views;

public partial class PostControl : UserControl
{
    public PostControl()
    {
        InitializeComponent();
    }

    private void Grid_PointerReleased(object? sender, PointerReleasedEventArgs e)
    {
        PostWithDetailsCommand post = (DataContext as PostWithDetailsCommand)!;
        post.DetailsCommand.Execute(post.Id);
    }
}
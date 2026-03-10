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
    private void Grid_Tapped(object? sender, TappedEventArgs e)
    {
        Post post = (DataContext as Post)!;
        post.DetailsCommand!.Execute(null);
    }
}
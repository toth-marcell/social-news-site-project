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
    private void Grid_PointerPressed(object? sender, PointerPressedEventArgs e)
    {
        if (e.Properties.IsLeftButtonPressed)
        {
            Post post = (DataContext as Post)!;
            post.DetailsCommand!.Execute(null);
        }
    }
}
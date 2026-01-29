using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using CommunityToolkit.Mvvm.Input;

namespace SocialNewsApp;

public partial class LogInOrRegisterView : UserControl
{
    public string Name { get; set; }
    public string Password { get; set; }
    public RelayCommand CancelCommand { get; set; }
    public LogInOrRegisterView()
    {
        InitializeComponent();
        DataContext = this;
        CancelCommand = new(()=>this.)
    }
}
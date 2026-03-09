using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Data.Core.Plugins;
using Avalonia.Markup.Xaml;
using SocialNewsApp.ViewModels;
using SocialNewsApp.Views;
using System.Linq;

namespace SocialNewsApp;

public partial class App : Application
{
    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
    }

    public override void OnFrameworkInitializationCompleted()
    {
        MainViewModel mainViewModel = new();
        MainView mainView = new() { DataContext = mainViewModel };
        TopLevel topLevel = null!;

        if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            // Avoid duplicate validations from both Avalonia and the CommunityToolkit. 
            // More info: https://docs.avaloniaui.net/docs/guides/development-guides/data-validation#manage-validationplugins
            DisableAvaloniaDataAnnotationValidation();
            desktop.MainWindow = new MainWindow { Content = mainView };
            topLevel = TopLevel.GetTopLevel(desktop.MainWindow)!;
        }
        else if (ApplicationLifetime is ISingleViewApplicationLifetime singleViewPlatform)
        {
            singleViewPlatform.MainView = mainView;
            topLevel = TopLevel.GetTopLevel(singleViewPlatform.MainView)!;
        }

        topLevel.PointerPressed += (s, e) =>
        {
            if (e.Properties.IsXButton1Pressed)
            {
                mainViewModel.BackCommand.Execute(null);
            }
        };
        topLevel.BackRequested += (s, e) =>
        {
            if (!mainViewModel.IsMainActive)
            {
                mainViewModel.BackCommand.Execute(null);
                e.Handled = true;
            }
        };

        base.OnFrameworkInitializationCompleted();
    }

    private void DisableAvaloniaDataAnnotationValidation()
    {
        // Get an array of plugins to remove
        var dataValidationPluginsToRemove =
            BindingPlugins.DataValidators.OfType<DataAnnotationsValidationPlugin>().ToArray();

        // remove each entry found
        foreach (var plugin in dataValidationPluginsToRemove)
        {
            BindingPlugins.DataValidators.Remove(plugin);
        }
    }
}
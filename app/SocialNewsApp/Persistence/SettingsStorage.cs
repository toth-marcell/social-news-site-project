using System;
using System.IO;
using System.Text;

namespace SocialNewsApp.Persistence;

public static class SettingsStorage
{
    private static readonly string SettingsFolder = $"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}/SocialNewsApp/";
    public static string? Token
    {
        get
        {
            try
            {
                return File.ReadAllText(SettingsFolder + "token", Encoding.UTF8);
            }
            catch { return null; }
        }
        set => File.WriteAllText(SettingsFolder + "token", value, Encoding.UTF8);
    }
    static SettingsStorage()
    {
        Directory.CreateDirectory(SettingsFolder);
    }
}

using CommunityToolkit.Mvvm.ComponentModel;

namespace SocialNewsApp.Models
{
    public partial class PostPage : ObservableObject
    {
        [ObservableProperty]
        Post[] posts;
        [ObservableProperty]
        int count;
        [ObservableProperty]
        int limit;
        [ObservableProperty]
        int offset;
        public bool IsNextPageAvailable => Offset + Limit < Count;
    }
}

Media = (function() {
    return {};
})();

Media.get_youtube_video_id = function(url) {
    var matched = /https?:\/\/youtu\.be\/([^?]+)(?:\?.+)?/.exec(url);

    if (!matched) {
        matched = /https?:\/\/.*youtube\.com\/.*\?.*v=([^&]+).*/.exec(url);
    }

    if (matched) {
        return matched[1];
    }
}

__MODULE__ = Media;

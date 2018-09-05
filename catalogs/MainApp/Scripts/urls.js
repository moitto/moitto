Urls = (function() {
    return {};
})();

Urls.parse_steem_url = function(url) {
    var matched = /https?:\/\/((?:[a-z0-9]+\.?)+)(?:\/[a-zA-Z0-9_@%:/.\-]+)?\/@([^\/]+)\/([^/?#]+)/.exec(url);

    if (matched && Urls.__is_steem_host(matched[1])) {
        return matched.slice(1);
    }
}

Urls.get_youtube_video_id = function(url) {
    var matched = /https?:\/\/.*youtube\.com\/.*\?.*v=([^&/?#]+).*/.exec(url);

    if (!matched) {
        matched = /https?:\/\/.*youtube\.com\/embed\/([^/?#]+).*/.exec(url);
    }

    if (!matched) {
        matched = /https?:\/\/youtu\.be\/([^/?#]+)(?:\?.+)?/.exec(url);
    }

    if (matched) {
        return matched[1];
    }
}

Urls.get_path_extension = function(url) {
    var matched = /\.([^./]+)$/.exec(url);

    if (matched) {
        return matched[1];
    }
}

Urls.__is_steem_host = function(host) {
    var known_hosts = [ "steemit.com", "busy.org", "steemkr.com" ];

    for (var i = 0; i < known_hosts.length; i++) {
        if (host.includes(known_hosts[i])) {
            return true;
        }
    }

    return false;
}

__MODULE__ = Urls;

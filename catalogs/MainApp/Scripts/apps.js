Apps = (function() {
    return {};
})();

Apps.open_app = function(author, permlink, url) {
    controller.action("app", { 
        "url":Apps.__get_app_url(params["url"])
    });
}

Apps.__get_app_url = function(url) {
    var github = /github:\/\/([^/]+)\/([^/]+)/.exec(url);

    if (github) {
        return "https://github.com/" + github[1] + "/" + github[2] + "/archive/master.zip";
    }

    return url;
}

__MODULE__ = Apps;

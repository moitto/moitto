Apps = (function() {
    return {};
})();

Apps.open_app = function(author, permlink, url) {
    controller.action("app", { 
        "url":Apps.__get_app_url(url)
    });
}

Apps.authorize_app = function(app_id) {
    var app_info = controller.data("app", app_id);

    controller.catalog().submit("collection", "authorized.apps", "C_AUTHORIZED.APPS_" + app_id, {
        "app-id":app_info["id"],
        "version":app_info["version"] || "1.0",
        "title":app_info["title"] || "",
        "owner":app_info["owner"] || "",
    });
}

Apps.is_authorized = function(app_id) {
    var value = controller.catalog().value("collection", "authorized.apps", "C_AUTHORIZED.APPS_" + app_id);

    if (value) {
        return true;
    }

    return false;
}

Apps.get_authorized_apps = function(location, length) {
    var values = controller.catalog().values("collection", "authorized.apps", null, null, [ location, length ])
    var apps = [];

    values.forEach(function(value) {
        apps.push(value);
    });

    return apps;
}

Apps.__get_app_url = function(url) {
    var github = /github:\/\/([^/]+)\/([^/]+)/.exec(url);

    if (github) {
        return "https://github.com/" + github[1] + "/" + github[2] + "/archive/master.zip";
    }

    return url;
}

__MODULE__ = Apps;

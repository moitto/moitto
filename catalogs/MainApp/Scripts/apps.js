Apps = (function() {
    return {};
})();

Apps.steemjs = require("steemjs");

Apps.open_app = function(url, referrer) {
    if (referrer && !referrer["tags"]) {
        Apps.steemjs.get_content(referrer["author"], referrer["permlink"]).then(function(response) {
            referrer = Object.assign(referrer, { "tags":response.meta["tags"] });

            if (!Apps.__is_login_required(referrer) || storage.value("ACTIVE_USER")) {
                controller.action("app", Apps.__get_app_params(url, referrer));
            } else {
                controller.action("subview", { 
                    "subview":"V_LOGIN", 
                    "target":"popup",
                    "close-popup":"yes" 
                });
            }
        }, function(reason) {
            controller.action("alert", { "message":"죄송합니다. 앱을 실행할 수 없습니다." });
        });
    } else {
        if (!Apps.__is_login_required(referrer) || storage.value("ACTIVE_USER")) {
            controller.action("app", Apps.__get_app_params(url, referrer));
        } else {
            controller.action("subview", { 
                "subview":"V_LOGIN", 
                "target":"popup",
                "close-popup":"yes" 
            });
        }
    }
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

Apps.__is_login_required = function(referrer) {
    var tags_required_login = [ "moitto-quest" ];
    var tags = referrer ? referrer["tags"] : [];

    for (var i = 0; i < tags.length; ++i) {
        if (tags_required_login.includes(tags[i])) {
            return true;
        }
    }

    return false;
}

Apps.__get_app_params = function(url, referrer) {
    var params = { "url":Apps.__get_app_url(url) };

    if (referrer && referrer["tags"].includes("moitto-quest")) {
        return Object.assign(params, {
            "app-params":Apps.__to_action_params({
                "script":"start_quest",
                "subview":"__MAIN__",
                "author":referrer["author"],
                "permlink":referrer["permlink"]
            })
        });
    }

    return params;
}

Apps.__get_app_url = function(url) {
    var github = /github:\/\/([^/]+)\/([^/]+)/.exec(url);

    if (github) {
        return "https://github.com/" + github[1] + "/" + github[2] + "/archive/master.zip";
    }

    return url;
}

Apps.__to_action_params = function(params) {
    return Object.keys(params).map(function(k) {
        return k + "=" + params[k];
    }).join(',')
}

__MODULE__ = Apps;

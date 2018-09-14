SteemConnect = (function() {
    return {};
})();

SteemConnect.connect  = require("connect");
SteemConnect.settings = require("settings");
SteemConnect.urls     = require("urls");

SteemConnect.handle_url = function(url, referrer) {
    var matched = /steemconnect\.com\/sign\/([^/?]+)\/?\?(.+)/g.exec(url);

    if (matched) {
        var params = Object.assign(SteemConnect.urls.parse_query(matched[2]), {
            "prompts":"yes"
        });

        if (referrer) {
            params["referrer"] = referrer;
        }

        SteemConnect.invoke(matched[1], params);

        return true;
    }

    return false;
}

SteemConnect.invoke = function(method, params) {
    if (Actions.settings.wallet_features_allowed()) {
        if (SteemConnect.hasOwnProperty("__invoke_" + method.replace("-", "_"))) {
            SteemConnect["__invoke_" + method.replace("-", "_")](params);
        } else {
            SteemConnect.__browse_steemconnect(method, params);
        }
    } else {
        SteemConnect.__browse_steemconnect(method, params);
    }
}

SteemConnect.__invoke_transfer = function(params) {
    var username = storage("ACTIVE_USER") || "";

    if (!params["from"] || params["from"] === username) {
        SteemConnect.connect.invoke("transfer", {
            "to":params["to"],
            "amount":parseFloat(params["amount"].split(" ")[0]),
            "coin":params["amount"].split(" ")[1]
        });
    } else {
        SteemConnect.__browse_steemconnect("transfer", params);
    }
}

SteemConnect.__browse_steemconnect = function(method, params) {
    var query = SteemConnect.urls.build_query(params);
    var url = "https://v2.steemconnect.com/sign/" + method + "?" + query;

    controller.action("link", {
        "url":url,
        "target":"browser"
    });
}

__MODULE__ = SteemConnect;

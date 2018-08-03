Connect = (function() {
    return {};
})();

Connect.books = require("books");

Connect.handle_url = function(url, referrer) {
    var matched = /moitto\.io\/connect\/([^/?]+)\/?\?(.+)/g.exec(url);

    if (matched) {
        var params = Connect.__parse_query(matched[2]);

        if (referrer) {
            params["author"]   = referrer[0];
            params["permlink"] = referrer[1];
        }

        Connect.invoke(matched[1], params);

        return true;
    }

    return false;
}

Connect.invoke = function(method, params) {
    if (method === "app") {
        Connect.__invoke_app(params);

        return;
    }

    if (method === "book") {
        Connect.__invoke_book(params);

        return;
    }

    if (method === "transfer") {
        Connect.__invoke_transfer(params);

        return;
    }

    if (method === "pay") {
        Connect.__invoke_pay(params);
        
        return;
    }

    if (method === "delegate") {
        Connect.__invoke_delegate(params);
        
        return;
    }

    if (method === "follow") {
        Connect.__invoke_follow(params);
        
        return;
    }
}

Connect.__invoke_app = function(params) {
    controller.action("app", { "url":Connect.__get_app_url(params["url"]) });
}

Connect.__invoke_book = function(params) {
    Connect.books.open_book(params["author"], params["permlink"], params["url"]);
}

Connect.__invoke_transfer = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", {
        "to":params["to"],
        "amount":params["amount"],
        "amount-type":params["amount-type"] || "SBD",
        "coin":params["coin"] || "SBD",
        "currency":params["currency"] || "KRW",
        "hidden":params["hidden"] || "no"
    });

    controller.action("subview", { "subview":"V_TRANSFER", "target":"popup" });
}

Connect.__invoke_pay = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_PAY", {
        "to":params["to"],
        "amount":params["amount"],
        "amount-type":params["amount-type"] || "SBD",
        "coin":params["coin"] || "SBD",
        "currency":params["currency"] || "KRW"
     });

    controller.action("subview", { "subview":"V_PAY", "target":"popup" });
}

Connect.__invoke_delegate = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE", {
         "to":params["to"],
         "amount":params["amount"]
     });

    controller.action("subview", { "subview":"V_DELEGATE", "target":"popup" });
}

Connect.__invoke_follow = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_FOLLOW", {
         "following":params["following"]
     });

    controller.action("subview", { "subview":"V_FOLLOW", "target":"popup" });
}

Connect.__get_app_url = function(url) {
    var github = /github:\/\/([^/]+)\/([^/]+)/.exec(url);

    if (github) {
        return "https://github.com/" + github[1] + "/" + github[2] + "/archive/master.zip";
    }

    return url;
}

Connect.__parse_query = function(query) {
    var params = {};

    query.split('&').forEach(function(text) {
        var pair  = text.split('=');
        var key   = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1] || '')

        params[key.replace("_", "-")] = value;
    });

    return params;
}

__MODULE__ = Connect;

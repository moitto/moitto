Connect = (function() {
    return {};
})();

Connect.apps  = require("apps");
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
    Connect.apps.open_app(
        params["author"], params["permlink"], params["url"]
    );
}

Connect.__invoke_book = function(params) {
    Connect.books.open_book(
        params["author"], params["permlink"], params["url"]
    );
}

Connect.__invoke_transfer = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", Object.assign({
        "to":params["to"],
        "amount":params["amount"] || "",
        "amount-type":params["amount-type"] || "SBD",
        "coin":params["coin"] || "SBD",
        "currency":params["currency"] || "KRW"
    }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_TRANSFER", "target":"popup" });
}

Connect.__invoke_delegate = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE", Object.assign({
        "to":params["to"],
        "amount":params["amount"] || ""
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_DELEGATE", "target":"popup" });
}

Connect.__invoke_follow = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_FOLLOW", Object.assign({
        "following":params["following"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_FOLLOW", "target":"popup" });
}

Connect.__invoke_params = function(params) {
    return {
        "return-script":params["return-script"] || "",
        "return-subview":params["return-subview"] || "",
        "request-id":params["request-id"] || "",
        "source-app":params["source-app"] || ""
    }
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

Connect = (function() {
    return {};
})();

Connect.books = require("books");

Connect.handle_url = function(url, referrer) {
    var matched = /connect\/([^/?]+)\/?\?(.+)/g.exec(url);

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
}

Connect.__invoke_app = function(params) {
    controller.action("app", { "url":params["url"] });
}

Connect.__invoke_book = function(params) {
    Connect.books.open_book(params["author"], params["permlink"], params["url"]);
}

Connect.__invoke_transfer = function(params) {
    controller.catalog().remove("showcase", "auxiliary", "S_TRANSFER");
    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", {
        "to":params["to"],
        "amount":params["amount"],
        "hidden":params["hidden"] || "no"
    });

    controller.action("page", { "display-unit":"S_TRANSFER" });
}

Connect.__invoke_pay = function(params) {
    controller.catalog().remove("showcase", "auxiliary", "S_PAY");
    controller.catalog().submit("showcase", "auxiliary", "S_PAY", {
         "to":params["to"],
         "amount":params["amount"]
     });

    controller.action("page", { "display-unit":"S_PAY" });
}

Connect.__parse_query = function(query) {
    var params = {};

    query.split('&').forEach(function(text) {
        var pair  = text.split('=');
        var key   = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1] || '')

        params[key] = value;
    });

    return params;
}

__MODULE__ = Connect;

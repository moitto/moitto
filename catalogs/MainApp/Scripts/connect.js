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
    if (Connect.hasOwnProperty("__invoke_" + method)) {
        Connect["__invoke_" + method](params);
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
        "coin":params["coin"] || "SBD",
        "currency":params["currency"] || "KRW",
        "amount-type":params["amount-type"] || (params["coin"] || "SBD"),
        "amount":params["amount"] || ""
    }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_TRANSFER", "target":"popup" });
}

Connect.__invoke_delegate = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE", Object.assign({
        "to":params["to"],
        "coin":params["coin"] || "SP",
        "amount":params["amount"] || ""
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_DELEGATE", "target":"popup" });
}

Connect.__invoke_undelegate = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_UNDELEGATE", Object.assign({
        "from":params["from"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_UNDELEGATE", "target":"popup" });
}

Connect.__invoke_power_up = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_POWER_UP", Object.assign({
        "coin":params["coin"] || "STEEM",
        "amount":params["amount"] || ""
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_POWER_UP", "target":"popup" });
}

Connect.__invoke_power_down = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_POWER_DOWN", Object.assign({
        "coin":params["coin"] || "SP",
        "amount":params["amount"] || ""
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_POWER_DOWN", "target":"popup" });
}

Connect.__invoke_follow = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_FOLLOW", Object.assign({
        "following":params["following"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_FOLLOW", "target":"popup" });
}

Connect.__invoke_unfollow = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_UNFOLLOW", Object.assign({
        "following":params["following"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_UNFOLLOW", "target":"popup" });
}

Connect.__invoke_mute = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_MUTE", Object.assign({
        "following":params["following"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_MUTE", "target":"popup" });
}

Connect.__invoke_unmute = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_UNMUTE", Object.assign({
        "following":params["following"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_UNMUTE", "target":"popup" });
}

Connect.__invoke_vote = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_VOTE", Object.assign({
        "author":params["author"],
        "permlink":params["permlink"],
        "weight":params["weight"] || ""
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_UNMUTE", "target":"popup" });
}

Connect.__invoke_reblog = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_REBLOG", Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_UNMUTE", "target":"popup" });
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

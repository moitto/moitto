API = (function() {
    return {};
})();

API.connect = require("connect");

API.query_account = function(params) {
    API.connect.invoke("open_discussion", Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
    }, API.__invoke_params(params)));
}

API.open_discussion = function(params) {
    API.connect.invoke("open_discussion", Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
    }, API.__invoke_params(params)));
}

API.show_user = function(params) {
    API.connect.invoke("show_user", Object.assign({
        "username":params["username"]
    }, API.__invoke_params(params)));
}

API.show_votes = function(params) {
    API.connect.invoke("show_votes", Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
    }, API.__invoke_params(params)));
}

API.show_replies = function(params) {
    API.connect.invoke("show_replies", Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
    }, API.__invoke_params(params)));
}

API.show_tag = function(params) {
    API.connect.invoke("show_tag", Object.assign({
        "tag":params["tag"]
    }, API.__invoke_params(params)));
}

API.vote = function(params) {
    API.connect.invoke("vote", Object.assign({
        "author":params["author"],
        "permlink":params["permlink"],
        "weight":params["weight"] || ""
    }, API.__invoke_params(params)));
}

API.reblog = function(params) {
    API.connect.invoke("reblog", Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
    }, API.__invoke_params(params)));
}

API.comment = function(params) {
    API.connect.invoke("comment", Object.assign({
        "parent-author":params["parent-author"],
        "parent-permlink":params["parent-permlink"],
        "permlink":params["permlink"] || "",
        "body":params["body"] || ""
    }, API.__invoke_params(params)));
}

API.delete_comment = function(params) {
    API.connect.invoke("delete_comment", Object.assign({
        "parent-author":params["parent-author"],
        "parent-permlink":params["parent-permlink"],
        "permlink":params["permlink"]
    }, API.__invoke_params(params)));
}

API.follow = function(params) {
    API.connect.invoke("follow", Object.assign({
        "following":params["following"]
    }, API.__invoke_params(params)));
}

API.unfollow = function(params) {
    API.connect.invoke("unfollow", Object.assign({
        "following":params["following"]
    }, API.__invoke_params(params)));
}

API.mute = function(params) {
    API.connect.invoke("mute", Object.assign({
        "following":params["following"]
    }, API.__invoke_params(params)));
}

API.unmute = function(params) {
    API.connect.invoke("unmute", Object.assign({
        "following":params["following"]
    }, API.__invoke_params(params)));
}

API.transfer = function(params) {
    API.connect.invoke("transfer", Object.assign({
        "to":params["to"], 
        "coin":params["coin"] || "SBD",
        "currency":params["currency"] || "KRW",
        "amount-type":params["amount-type"] || (params["coin"] || "SBD"),
        "amount":params["amount"] || ""
    }, API.__invoke_params(params)));
}

API.delegate = function(params) {
    API.connect.invoke("delegate", Object.assign({
        "to":params["to"], 
        "coin":params["coin"] || "SP", 
        "amount":params["amount"] || ""
    }, API.__invoke_params(params)));
}

API.undelegate = function(params) {
    API.connect.invoke("undelegate", Object.assign({
        "from":params["from"],
        "coin":params["coin"] || "SP"
    }, API.__invoke_params(params)));
}

API.power_up = function(params) {
    API.connect.invoke("power_up", Object.assign({
        "coin":params["coin"] || "STEEM", 
        "amount":params["amount"] || ""
    }, API.__invoke_params(params)));
}

API.power_down = function(params) {
    API.connect.invoke("power_down", Object.assign({
        "coin":params["coin"] || "SP", 
        "amount":params["amount"] || ""
    }, API.__invoke_params(params)));
}

API.redeem_rewards = function(params) {
    API.connect.invoke("redeem_rewards", Object.assign({
        /* nothing */
    }, API.__invoke_params(params)));
}

API.start_quest = function(params) {
    API.connect.invoke("start_quest", Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
    }, API.__invoke_params(params)));
}

API.finish_quest = function(params) {
    API.connect.invoke("finish_quest", Object.assign({
        "author":params["author"],
        "permlink":params["permlink"],
        "comment":params["comment"]
    }, API.__invoke_params(params)));
}

API.__invoke_params = function(params) {
    return {
        "return-script":params["return-script"] || "",
        "return-subview":params["return-subview"] || "",
        "request-id":params["request-id"] || "",
        "source-app":params["source-app"] || ""
    }
}

__MODULE__ = API;

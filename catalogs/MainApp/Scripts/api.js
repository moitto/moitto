API = (function() {
    return {};
})();

API.connect = require("connect");
API.actions = require("actions");

API.vote = function(params) {
}

API.reblog = function(params) {
}

API.comment = function(params) {
}

API.delete_comment = function(params) {
}

API.follow_user = function(params) {
}

API.unfollow_user = function(params) {
}

API.mute_user = function(params) {
}

API.unmute_user = function(params) {
}

API.transfer = function(params) {
    API.connect.invoke("transfer", Object.assign({
        "to":params["to"], 
        "amount":params["amount"] || "",
        "amount-type":params["amount-type"] || "SBD",
        "coin":params["coin"] || "SBD",
        "currency":params["currency"] || "KRW"
    }, API.__invoke_params(params)));
}

API.delegate = function(params) {
    API.connect.invoke("delegate", Object.assign({
        "to":params["to"], 
        "amount":params["amount"] || ""
    }, API.__invoke_params(params)));
}

API.power_up = function(params) {
}

API.power_down = function(params) {
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

Connect = (function() {
    return {
        __handlers:{}
    };
})();

Connect.actions = require("actions");
Connect.apps    = require("apps");
Connect.books   = require("books");

Connect.handle_url = function(url, referrer) {
    var matched = /moitto\.io\/connect\/([^/?]+)\/?\?(.+)/g.exec(url);

    if (matched) {
        var params = Object.assign(Connect.__parse_query(matched[2]), {
            "prompts":"yes"
        });

        if (referrer) {
            params["referrer"] = referrer;
        }

        Connect.invoke(matched[1], params);

        return true;
    }

    return false;
}

Connect.invoke = function(method, params) {
    if (params["source-app"] && !Connect.apps.is_authorized(params["source-app"])) {
        if (!Connect.__is_free_method(method) && $env["SIMULATOR"] !== "yes") {
            Connect.__authorize_app(params["source-app"], function() {
                if (Connect.hasOwnProperty("__invoke_" + method)) {
                    Connect["__invoke_" + method](params);
                }                
            });
        } else {
            if (Connect.hasOwnProperty("__invoke_" + method)) {
                Connect["__invoke_" + method](params);
            }
        }
    } else {
        if (Connect.hasOwnProperty("__invoke_" + method)) {
            Connect["__invoke_" + method](params);
        }
    }
}

Connect.__authorize_app = function(app_id, handler) {
    var app_info = controller.data("app", app_id);
    var request_id = new Date().toISOString().replace(/[.:\-]/g, "").toLowerCase();

    controller.catalog().submit("showcase", "auxiliary", "S_AUTHORIZE_APP", {
        "app-id":app_info["id"],
        "language":app_info["language"],
        "version":app_info["version"],
        "title":app_info["title"] || "",
        "description":app_info["description"] || "",
        "owner":app_info["owner"] || "",
        "request-id":request_id,
        "return-script":"Connect.__on_authorize_app",
        "return-subview":$data["SUBVIEW"] || "__MAIN__"
    });

    Connect.__handlers[request_id] = handler;

    controller.action("subview", { "subview":"V_AUTHORIZE_APP", "target":"popup" });
}

Connect.__on_authorize_app = function(params) {
   var handler = Connect.__handlers[params["request-id"] || ""];

    if (handler) {
        handler(params);
    }

    delete Connect.__handlers["request-id"];
}

Connect.__invoke_open_discussion = function(params) {
    Connect.actions.open_discussion(Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
    }, Connect.__invoke_params(params)));
}

Connect.__invoke_show_user = function(params) {
    Connect.actions.show_user(Object.assign({
        "username":params["username"]
    }, Connect.__invoke_params(params)));
}

Connect.__invoke_show_votes = function(params) {
    Connect.actions.show_votes(Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
    }, Connect.__invoke_params(params)));
}

Connect.__invoke_show_replies = function(params) {
    Connect.actions.show_replies(Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
    }, Connect.__invoke_params(params)));
}

Connect.__invoke_show_tag = function(params) {
    Connect.actions.show_tag(Object.assign({
        "tag":params["tag"]
    }, Connect.__invoke_params(params)));
}

Connect.__invoke_vote = function(params) {
    if (params["prompts"] == "yes" || !params["weight"]) {
        controller.catalog().submit("showcase", "auxiliary", "S_VOTE", Object.assign({
            "author":params["author"],
            "permlink":params["permlink"],
            "weight":params["weight"] || ""
        }, Connect.__invoke_params(params)));

        controller.action("subview", { "subview":"V_VOTE", "target":"popup" });
    } else {
        Connect.actions.vote(Object.assign({
            "author":params["author"],
            "permlink":params["permlink"],
            "weight":params["weight"] || ""
        }, Connect.__invoke_params(params)));
    }
}

Connect.__invoke_unvote = function(params) {
    if (params["prompts"] == "yes" || !params["weight"]) {
        controller.catalog().submit("showcase", "auxiliary", "S_UNVOTE", Object.assign({
            "author":params["author"],
            "permlink":params["permlink"]
        }, Connect.__invoke_params(params)));

        controller.action("subview", { "subview":"V_UNVOTE", "target":"popup" });
    } else {
        Connect.actions.unvote(Object.assign({
            "author":params["author"],
            "permlink":params["permlink"]
        }, Connect.__invoke_params(params)));
    }
}

Connect.__invoke_reblog = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_REBLOG", Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_REBLOG", "target":"popup" });
}

Connect.__invoke_comment = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_COMMENT", Object.assign({
        "parent-author":params["parent-author"],
        "parent-permlink":params["parent-permlink"],
        "permlink":params["permlink"] || "",
        "body":params["body"] || ""
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_COMMENT", "target":"popup" });
}

Connect.__invoke_delete_comment = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_DELETE_COMMENT", Object.assign({
        "parent-author":params["parent-author"],
        "parent-permlink":params["parent-permlink"],
        "permlink":params["permlink"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_DELETE_COMMENT", "target":"popup" });
}

Connect.__invoke_follow = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_FOLLOWING", Object.assign({
        "following":params["following"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_FOLLOW", "target":"popup" });
}

Connect.__invoke_unfollow = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_FOLLOWING", Object.assign({
        "following":params["following"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_UNFOLLOW", "target":"popup" });
}

Connect.__invoke_mute = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_FOLLOWING", Object.assign({
        "following":params["following"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_MUTE", "target":"popup" });
}

Connect.__invoke_unmute = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_FOLLOWING", Object.assign({
        "following":params["following"]
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_UNMUTE", "target":"popup" });
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
        "from":params["from"],
        "coin":params["coin"] || "SP"
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

Connect.__invoke_claim_rewards = function(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_CLAIM_REWARDS", Object.assign({
        /* nothing */
     }, Connect.__invoke_params(params)));

    controller.action("subview", { "subview":"V_CLAIM_REWARDS", "target":"popup" });
}

Connect.__invoke_start_quest = function(params) {
    Connect.actions.start_quest(Object.assign({
        "author":params["author"],
        "permlink":params["permlink"]
    }, Connect.__invoke_params(params)));
}

Connect.__invoke_finish_quest = function(params) {
    Connect.actions.finish_quest(Object.assign({
        "author":params["author"],
        "permlink":params["permlink"],
        "comment":params["comment"]
    }, Connect.__invoke_params(params)));
}

Connect.__invoke_app = function(params) {
    Connect.apps.open_app(
        params["app"], params["url"], params["referrer"]
    );
}

Connect.__invoke_book = function(params) {
    Connect.books.open_book(
        params["url"], params["referrer"]
    );
}

Connect.__is_free_method = function(method) {
    var free_methods = [ 
        "open_discussion",
        "show_user",
        "show_votes",
        "show_replies",
        "show_tag", 
        "start_quest",
        "finish_quest"
    ];

    if (free_methods.includes(method)) {
        return true;
    }

    return false;
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

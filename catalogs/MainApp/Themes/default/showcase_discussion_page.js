var connect = require("connect");
var users   = require("users");
var account = require("account");
var urls    = require("urls");

var __schedule_to_reload = false;

function on_loaded() {
    var referrer = [$data["author"], $data["permlink"]];
    var urls = __get_urls_in_content($data["body"]);

    urls.forEach(function(url) {
        if (connect.handle_url(url["url"], referrer)) {
            return;
        }
    });
}

function on_download_image() {
    if (!__schedule_to_reload) {
        timeout(0.5, function() {
            view.action("reload", { "keeps-position":"yes" });

            __schedule_to_reload = false;
        });
    }

    __schedule_to_reload = true;
}

function on_change_data(data) {
    if (data.hasOwnProperty("votes-weight")) {
        __update_vote_button(parseInt(data["vote-weight"]));
    }

    if (data.hasOwnProperty("votes-count")) {
        __update_votes_count_button(parseInt(data["votes-count"]));
    }

    if (data.hasOwnProperty("replies-count")) {
        __update_replies_count_button(parseInt(data["replies-count"]));
    }

    if (data.hasOwnProperty("payout-value")) {
        __update_payout_value_button(data["payout-value"]);
    }
}

function vote() {
    if (account.is_logged_in()) {
        var value = view.data("display-unit");

        if (parseInt(value["vote-weight"]) == 0) {
            controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.UPVOTE", {
                "author":$data["author"],
                "permlink":$data["permlink"]
            });
            controller.action("popup", { "display-unit":"S_DISCUSSION.UPVOTE" });
        } else {
            controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.UNVOTE", {
                "author":$data["author"],
                "permlink":$data["permlink"]
            });
            controller.action("popup", { "display-unit":"S_DISCUSSION.UNVOTE" });
        }
    } else {
        controller.action("subview", { 
            "subview":"V_LOGIN", 
            "target":"popup",
            "close-popup":"yes" 
        });
    }
}

function show_author() {
    var user = users.create($data["author"]);

    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });
    controller.action("page", { "display-unit":"S_USER", "target":"popup" })
}

function show_user(data) {
    var user = users.create(data["username"]);

    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });
    controller.action("page", { "display-unit":"S_USER", "target":"popup" })
}

function show_tag(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_TAG", {
        "tag":params["label"],
        "navibar-title":"#" + params["label"]
    });
    controller.action("page", { "display-unit":"S_TAG", "target":"popup" })    
}

function show_votes() {
    controller.catalog().submit("showcase", "auxiliary", "S_VOTES", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });
    controller.action("page", { "display-unit":"S_VOTES", "target":"popup" })
}

function show_replies() {
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });
    controller.action("page", { "display-unit":"S_REPLIES", "target":"popup" })
}

function open_url(params) {
    var steem_url = urls.parse_steem_url(params["url"]);

    if (steem_url) {
        var user = users.create(steem_url[1]);

        if (steem_url[2]) {
            var backgrounds = controller.catalog("ImageBank").values("showcase", "backgrounds", "C_COLOR", null, [ 0, 1 ], [ null, "random" ]);
            var discussion = Object.assign(__background_data_for_value(backgrounds[0]), {
                "author":user.name,
                "permlink":steem_url[2],
                "userpic-url":user.get_userpic_url("small")
            });

            controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION", discussion);
            controller.action("page", { "display-unit":"S_DISCUSSION", "target":"popup" });                
        } else {
            controller.catalog().submit("showcase", "auxiliary", "S_USER", {
                "username":user.name,
                "userpic-url":user.get_userpic_url("small"),
                "fetched":"no"
            });

            controller.action("page", { "display-unit":"S_USER", "target":"popup" })
        }

        return;
    }

    controller.action("link", { url:params["url"] });
}

function __update_vote_button(weight) {
    var button = view.object("btn.vote");

    if (weight != 0) {
        if (weight > 0) {
            button.property({
                "selected":"yes",
                "selected-image":"~/subview_btn_upvoted.png"
            });        
        } else {
            button.property({
                "selected":"yes",
                "selected-image":"~/subview_btn_downvoted.png"
            });        
        }
    } else {
        button.property({
            "selected":"no"
        });   
    }
}

function __update_votes_count_button(count) {
    var button = view.object("btn.votes.count");

    button.property({ "label":count.toString() });
}

function __update_payout_value_button(value) {
    var button = view.object("btn.payout.value");

    button.property({ "label":" " + value + " " });
}

function __update_replies_count_button(count) {
    var button = view.object("btn.replies.count");

    button.property({ "label":count.toString() });
}

function __background_data_for_value(value) {
    var data = { "background":value["id"] };

    Object.keys(value).forEach(function(key) {
        data["background." + key] = value[key];
    });

    return data;
}

function __get_urls_in_content(body) {
    var pattern = /\[([^\]]*)\]\(([^\)]+)\)/g;
    var matched = null;
    var urls = [];

    while (matched = pattern.exec(body)) {
        urls.push({
            "position":[ matched.index, pattern.lastIndex ],
            "alt":matched[1], 
            "url":matched[2]
        });
    }
    
    return urls;
}

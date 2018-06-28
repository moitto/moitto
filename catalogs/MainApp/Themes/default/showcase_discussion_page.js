var connect = require("connect");
var users   = require("users");
var account = require("account");

var __schedule_to_reload = false;

function on_loaded() {
    var referrer = [$data["author"], $data["permlink"]];
    var urls = __get_urls_in_content($data["body"]);

    urls.forEach(function(url) {
        if (connect.handle_url(url["url"], referrer)) {
            return;
        }
    });

    __update_vote();
}

function on_image_download() {
    if (!__schedule_to_reload) {
        timeout(0.5, function() {
            view.action("reload", { "keeps-position":"yes" });

            __schedule_to_reload = false;
        });
    }

    __schedule_to_reload = true;
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

function on_start_vote(form) {
    var value = document.value("VOTE");

    if (value["author"] === $data["author"] && value["permlink"] === $data["permlink"]) {

    }
}

function on_finish_vote(form) {
    var value = document.value("VOTE");

    if (value["author"] === $data["author"] && value["permlink"] === $data["permlink"]) {
        view.data("display-unit", { "vote-weight":value["weight"].toString() });

        __update_vote();
    }
}

function on_fail_vote(form) {
    var value = document.value("VOTE");

    if (value["author"] === $data["author"] && value["permlink"] === $data["permlink"]) {
        __update_vote();
    }
}

function show_author() {
    var user = users.create($data["author"]);

    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER" })
}

function show_user(data) {
    var user = users.create(data["username"]);

    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER" })
}

function show_tag(params) {
    controller.catalog().submit("showcase", "auxiliary", "S_TAG", {
        "tag":params["label"],
        "navibar-title":"#" + params["label"]
    });

    controller.action("page", { "display-unit":"S_TAG" })    
}

function show_votes() {
    controller.catalog().submit("showcase", "auxiliary", "S_VOTES", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });

    controller.action("page", { "display-unit":"S_VOTES" })
}

function show_replies() {
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });

    controller.action("page", { "display-unit":"S_REPLIES" })
}

function open_url(params) {
    var matched = /https?:\/\/((?:[a-z0-9]+\.?)+)(?:\/[a-zA-Z0-9_@%:\/\.\-]+)?\/@([^\/]+)\/([^\/]+)/.exec(params["url"]);

    if (matched) {
        if (__is_steem_host(matched[1])) {
            var user = users.create(matched[2]);

            if (matched[3]) {
                controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION", {
                    "author":user.name,
                    "permlink":matched[3],
                    "userpic-url":user.get_userpic_url("small")
                });
    
                controller.action("page", { "display-unit":"S_DISCUSSION" });                
            } else {
                controller.catalog().submit("showcase", "auxiliary", "S_USER", {
                    "username":user.name,
                    "userpic-url":user.get_userpic_url("small"),
                    "fetched":"no"
                });

                controller.action("page", { "display-unit":"S_USER" })
            }

            return;
        }
    }

    controller.action("link", { url:params["url"] });
}

function __is_steem_host(host) {
    var known_hosts = [ "steemit.com", "busy.org", "steemkr.com" ];

    for (var i = 0; i < known_hosts.length; i++) {
        if (host.includes(known_hosts[i])) {
            return true;
        }
    }

    return false;
}

function __update_vote() {
    var value = view.data("display-unit");

    __update_vote_button(parseInt(value["vote-weight"]));
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

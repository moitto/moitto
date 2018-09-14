var connect      = require("connect");
var steemconnect = require("steemconnect");
var users        = require("users");
var urls         = require("urls");

var __schedule_to_reload = false;

function on_loaded() {
    var tags = $data["tags"].split(",");

    if (tags) {
        __handle_tags(tags);
    }
}

function on_download_image() {
    if (!__schedule_to_reload) {
        timeout(0.5, function() {
            view.action("reload", { "keeps-position":"yes", "suppress-action":"yes" });

            __schedule_to_reload = false;
        });
    }

    __schedule_to_reload = true;
}

function on_change_data(id, data) {
    view.action("reload", { "keeps-position":"yes" });
}

function vote() {
    if (storage.value("ACTIVE_USER")) {
        var value = view.data("display-unit");

        if (parseInt(value["vote-weight"]) == 0) {
            controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.UPVOTE", {
                "author":$data["author"],
                "permlink":$data["permlink"],
                "payout-done":$data["payout-done"]
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

function show_user(params) {
    var user = users.create(params["username"]);

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
        "permlink":$data["permlink"],
        "tag":$data["main-tag"]
    });
    
    controller.action("page", { "display-unit":"S_REPLIES", "target":"popup" })
}

function show_ebook() {
    controller.catalog().submit("showcase", "auxiliary", "S_EBOOK", {
        "author":$data["author"],
        "permlink":$data["permlink"],
        "title":$data["title"]
    });

    controller.action("popup", { "display-unit":"S_EBOOK" });
}

function comment() {
    if (storage.value("ACTIVE_USER")) {
        controller.catalog().submit("showcase", "auxiliary", "S_COMMENT", {
            "parent-author":$data["author"],
            "parent-permlink":$data["permlink"]
        });

        controller.action("popup", { "display-unit":"S_COMMENT" });
    } else {
        controller.action("subview", { 
            "subview":"V_LOGIN", 
            "target":"popup",
            "close-popup":"yes" 
        });
    }
}

function open_url(params) {
    var steem_url = urls.parse_steem_url(params["url"]);

    if (steem_url) {
        var user = users.create(steem_url[1]);

        if (steem_url[2]) {
            var backgrounds = controller.catalog("StyleBank").values("showcase", "backgrounds", "C_COLOR", null, [ 0, 1 ], [ null, "random" ]);
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

    if (connect.handle_url(params["url"], __get_referrer())) {
        return;
    }

    if (steemconnect.handle_url(params["url"])) {
        return;
    }

    controller.action("link", { url:params["url"] });
}

function __handle_tags(tags) {
    if (tags.includes("moitto-ebook")) {
        show_ebook();

        return;
    }
}

function __background_data_for_value(value) {
    var data = { "background":value["id"] };

    Object.keys(value).forEach(function(key) {
        data["background." + key] = value[key];
    });

    return data;
}

function __get_referrer() {
    return {
        "author":$data["author"],
        "permlink":$data["permlink"],
        "tags":$data["tags"].split(",")
    }
}

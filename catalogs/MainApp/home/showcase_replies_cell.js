var account = require("account");
var users   = require("users");

var __schedule_to_reload = false;

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

}

function show_user() {
    var user = users.create($data["author"]);
    
    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER", "target":"popup" })
}

function show_replies() {
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES.CONTENT", $data);
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES", {
        "author":$data["author"],
        "permlink":$data["permlink"],
        "content-type":"reply",
        "has-own-navibar":"yes"
    });

    controller.action("page", { "display-unit":"S_REPLIES", "target":"popup" })
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

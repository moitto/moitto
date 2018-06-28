var users = require("users");

var __schedule_to_reload = false;

function on_image_download() {
    if (!__schedule_to_reload) {
        timeout(0.5, function() {
            view.action("reload", { "keeps-position":"yes" });

            __schedule_to_reload = false;
        });
    }

    __schedule_to_reload = true;
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

function show_replies() {
    controller.catalog().remove("showcase", "auxiliary", "S_REPLIES.CONTENT");
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES", {
        "author":$data["author"],
        "permlink":$data["permlink"],
        "content-type":"reply"
    });

    controller.action("page", { "display-unit":"S_REPLIES", "target":"popup" })
}

function vote() {
    __freeze_vote_button();

}

function __freeze_vote_button() {
    var button = view.object("btn.vote");

    button.property({ "enabled":"no" });
}

function __unfreeze_vote_button() {
    var button = view.object("btn.vote");

    button.property({ "enabled":"yes" });
}

function __select_vote_button() {
    var button = view.object("btn.vote");

    button.property({ "selected":"yes" });
}

var users = require("users");

function on_change_data(data) {
    view.action("reload", { "keeps-position":"yes" });
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

function show_tag() {
    controller.catalog().submit("showcase", "auxiliary", "S_TAG", {
        "tag":$data["main-tag"],
        "navibar-title":"#" + $data["main-tag"]
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

function __update_votes_count_button(count) {
    var button = view.object("btn.votes.count");

    button.property({ "label":count.toString() });
}

function __update_replies_count_button(count) {
    var button = view.object("btn.replies.count");

    button.property({ "label":count.toString() });
}

function __update_payout_value_button(value) {
    var button = view.object("btn.payout.value");

    button.property({ "label":" " + value + " " });
}

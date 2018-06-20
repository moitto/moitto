var users = require("users");

function show_user() {
    var user = users.create($data["author"]);
    
    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER" })
}

function show_tag() {
    controller.catalog().submit("showcase", "auxiliary", "S_TAG", {
        "tag":$data["main-tag"],
        "navibar-title":"#" + $data["main-tag"]
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
        "permlink":$data["permlink"],
        "tag":$data["main-tag"]
    });

    controller.action("page", { "display-unit":"S_REPLIES" })
}

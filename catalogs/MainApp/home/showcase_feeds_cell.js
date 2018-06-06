function show_user() {
    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":$data["author"],
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
        "permlink":$data["permlink"]
    });

    controller.action("page", { "display-unit":"S_REPLIES" })
}

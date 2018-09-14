function on_change_data(id, data) {
    view.action("reload");
}

function show_details() {
    controller.catalog().submit("showcase", "auxiliary", "S_USER.DETAILS", {
        "username":$data["username"],
        "userpic-url":$data["userpic-url"],
        "steem-balance":$data["steem-balance"],
        "steem-power":$data["steem-power"],
        "sbd-balance":$data["sbd-balance"],
        "fetched":"no"
    });

    controller.action("popup", {
        "display-unit":"S_USER.DETAILS",
        "alternate-name":"user.details"
    });
}

function show_blog() {
    controller.catalog().submit("showcase", "auxiliary", "S_BLOG", {
        "username":$data["username"],
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_BLOG", "target":"popup" });
}

function show_following() {
    controller.catalog().submit("showcase", "auxiliary", "S_FOLLOWING", {
        "username":$data["username"],
        "fetched":"no"
    });
    
    controller.action("page", { "display-unit":"S_FOLLOWING", "target":"popup" });
}

function show_followers() {
    controller.catalog().submit("showcase", "auxiliary", "S_FOLLOWERS", {
        "username":$data["username"],
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_FOLLOWERS", "target":"popup" });
}

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

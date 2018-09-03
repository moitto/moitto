var users = require("users");

function show_user() {
    var user = users.create($data["author"]);
    
    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });
    controller.action("page", { "display-unit":"S_USER", "target":"popup" })
}

function show_menu() {
    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.MENU", {
        "vote-weight":$data["vote-weight"],
        "payout-done":$data["payout-done"]
    });
    controller.action("popup", { "display-unit":"S_DISCUSSION.MENU" })
}

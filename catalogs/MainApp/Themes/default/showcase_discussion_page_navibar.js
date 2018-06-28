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
    var value = controller.catalog().value("showcase", "auxiliary", "S_DISCUSSION");
    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.MENU", {
        "vote-weight":value["vote-weight"]
    });
    controller.action("popup", { "display-unit":"S_DISCUSSION.MENU" })
}

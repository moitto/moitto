var users = require("users");

function on_change_data(identifier, data) {
    view.action("reload");
}

function vote() {
    if (storage.value("ACTIVE_USER")) {
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

function show_user() {
    var user = users.create($data["author"]);
    
    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER", "target":"popup" })
}

function follow() {
    if (storage.value("ACTIVE_USER")) {
        controller.action("script", {
            "script":"actions.follow",
            "subview":"__MAIN__",
            "routes-to-topmost":"no",
            "username":$data["username"]
        });

        __disable_follow_button();
    } else {
        controller.action("subview", { 
            "subview":"V_LOGIN", 
            "target":"popup",
            "close-popup":"yes" 
        });
    }
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

function __disable_follow_button() {
    var button = view.object("btn.follow");

    button.property({ "enabled":"no" });
}

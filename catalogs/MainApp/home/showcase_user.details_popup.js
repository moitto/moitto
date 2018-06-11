var account = require("account");

var __last_label_for_follow_buttons = {};

function on_loaded() {
    account.is_following($data["username"], function(username, is_following) {
        if (is_following) {
            __show_follow_button("unfollow");
        } else {
            __show_follow_button("follow");
        }
    });
}

function follow() {
    __freeze_follow_button("follow");

    account.follow_user($data["username"], function(response) {
        __hide_follow_button("follow");
        __show_follow_button("unfollow");
        __unfreeze_follow_button("follow");
    });
}

function unfollow() {
    __freeze_follow_button("unfollow");

    account.unfollow_user($data["username"], function(response) {
        __hide_follow_button("unfollow");
        __show_follow_button("follow");
        __unfreeze_follow_button("unfollow");
    });
}

function show_blog() {
    controller.catalog().submit("showcase", "auxiliary", "S_BLOG", {
        "username":$data["username"],
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_BLOG" });
}

function show_following() {
    controller.catalog().submit("showcase", "auxiliary", "S_FOLLOWING", {
        "username":$data["username"],
        "fetched":"no"
    });
    
    controller.action("page", { "display-unit":"S_FOLLOWING" });
}

function show_followers() {
    controller.catalog().submit("showcase", "auxiliary", "S_FOLLOWERS", {
        "username":$data["username"],
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_FOLLOWERS" });
}

function __show_follow_button(id) {
    var button = view.object("btn." + id);

    button.action("show");
}

function __hide_follow_button(id) {
    var button = view.object("btn." + id);

    button.action("hide");
}

function __freeze_follow_button(id) {
    var button = view.object("btn." + id);

    __last_label_for_follow_buttons[id] = button.value("label");

    button.property({ "label":"···"} );
    button.property({ "enabled":"no" });
}

function __unfreeze_follow_button(id) {
    var button = view.object("btn." + id);

    button.property({ "label":__last_label_for_follow_buttons[id] });
    button.property({ "enabled":"yes" });
}

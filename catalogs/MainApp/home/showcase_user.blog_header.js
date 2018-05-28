var account = require("account");
var steemjs = require("steemjs");

var __last_label_for_follow_buttons = {};

function on_loaded() {
    var me = storage.value("ACTIVE_USER");

    steemjs.get_followers($data["username"], me, "blog", 1).then(function(response) {
        if (response.length == 0 || response[0]["follower"] !== me) {
            __show_follow_button("btn.follow");
        } else {
            __show_follow_button("btn.unfollow");
        }
    });
}

function follow() {
    __freeze_follow_button("btn.follow");

    account.follow_user($data["username"], function(response) {
        __hide_follow_button("btn.follow");
        __show_follow_button("btn.unfollow");
        __unfreeze_follow_button("btn.follow");
    });
}

function unfollow() {
    __freeze_follow_button("btn.unfollow");

    account.unfollow_user($data["username"], function(response) {
        __hide_follow_button("btn.unfollow");
        __show_follow_button("btn.follow");
        __unfreeze_follow_button("btn.unfollow");
    });
}

function __show_follow_button(id) {
    var button = view.object(id);

    button.action("show");
}

function __hide_follow_button(id) {
    var button = view.object(id);

    button.action("hide");
}

function __freeze_follow_button(id) {
    var button = view.object(id);

    __last_label_for_follow_buttons[id] = button.value("label");

    button.property({ "label":"···"} );
    button.property({ "enabled":"no" });
}

function __unfreeze_follow_button(id) {
    var button = view.object(id);

    button.property({ "label":__last_label_for_follow_buttons[id] });
    button.property({ "enabled":"yes" });
}

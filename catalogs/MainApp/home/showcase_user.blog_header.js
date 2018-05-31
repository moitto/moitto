var account = require("account");
var steemjs = require("steemjs");

var __last_label_for_follow_buttons = {};

function on_loaded() {
    console.log("on_loaded!!!");
    steemjs.get_followers($data["username"], account.username, "blog", 1).then(function(response) {
        if (response.length == 0 || response[0]["follower"] !== account.username) {
            __show_follow_button("follow");
        } else {
            __show_follow_button("unfollow");
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

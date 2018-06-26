var account = require("account");
var global  = require("global");
var steemjs = require("steemjs");

var __last_label_for_follow_buttons = {};

function on_loaded() {
    steemjs.get_followers($data["subview.following"], account.username, "blog", 1).then(function(response) {
        if (response.length == 0 || response[0]["follower"] !== me) {
            __show_follow_button("follow");
        } else {
            __show_follow_button("followed");
            __show_followed_label();
        }
    });

    global.get_user($data["subview.following"]).then(function(user) {
        __update_following_userpic(user);
        __update_following_reputation(user);
    });
}

function follow() {
    __freeze_follow_button("follow");

    account.follow_user($data["subview.following"], function(response) {
        __hide_follow_button("follow");
        __show_follow_button("followed");
        __unfreeze_follow_button("follow");
    });
}

function __update_following_userpic(user) {
    var image = view.object("img.following.userpic");
    var userpic_url = user.get_userpic_url();

    image.property({ "image-url":userpic_url });
}

function __update_following_reputation(user) {
    var userpic_url = user.get_userpic_url();

    image.property({ "image-url":userpic_url });
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

var account = require("account");
var steemjs = require("steemjs");
var global  = require("global");
var users   = require("users");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_USER.DETAILS");

    __get_user(value["username"], function(user, follows, muted) {
        var data = {
            "username":user.name, 
            "userpic-url":user.get_userpic_url(),
            "reputation":user.get_reputation().toFixed(1).toString(),
            "post-count":user.get_post_count().toString(),
            "following-count":user.get_following_count().toString(),
            "follower-count":user.get_follower_count().toString(),
            "steem-balance":user.get_steem_balance().toFixed(3).toString(),
            "steem-power":user.get_steem_power().toFixed(3).toString(),
            "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
            "follows":follows ? "yes" : "no",
            "muted":muted ? "yes" : "no",
            "fetched":"yes"
        };

        controller.update("user-" + user.name, {
            "reputation":user.get_reputation().toFixed(1).toString(),
            "post-count":user.get_post_count().toString(),
            "following-count":user.get_following_count().toString(),
            "follower-count":user.get_follower_count().toString(),
            "steem-balance":user.get_steem_balance().toFixed(3).toString(),
            "steem-power":user.get_steem_power().toFixed(3).toString(),
            "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
            "follows":follows ? "yes" : "no",
            "muted":muted ? "yes" : "no"
        });

        view.data("display-unit", data);
        view.action("reload");            
    });
}

function on_change_data() {
    view.action("reload");
}

function follow() {
    controller.action("script", {
        "script":"api.follow_user",
        "subview":"__MAIN__",
        "username":$data["username"]
    });

    __disable_follow_buttons();
}

function unfollow() {
    controller.action("script", {
        "script":"api.unfollow_user",
        "subview":"__MAIN__",
        "username":$data["username"]
    });

    __disable_follow_buttons();
}

function mute() {
    controller.action("script", {
        "script":"api.mute_user",
        "subview":"__MAIN__",
        "username":$data["username"]
    });

    __disable_follow_buttons();
}

function unmute() {
    controller.action("script", {
        "script":"api.unmute_user",
        "subview":"__MAIN__",
        "username":$data["username"]
    });

    __disable_follow_buttons();
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

function __get_user(username, handler) {
    var me = storage.value("ACTIVE_USER") || "";

    Promise.all([
        steemjs.get_accounts([ username ]),
        steemjs.get_follow_count(username),
        steemjs.get_dynamic_global_properties(),
        steemjs.get_followers(username, me, "blog", 1),
        steemjs.get_followers(username, me, "ignore", 1)
    ]).then(function(response) {
        console.log(JSON.stringify(response));
        if (response[0][0]) {
            var user = users.create(username, response[0][0], response[1], global.create(response[2]));
            var follows = (response[3].length == 0 || response[3][0]["follower"] !== me) ? false : true;
            var muted   = (response[4].length == 0 || response[4][0]["follower"] !== me) ? false : true;

            handler(user, follows, muted);
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
}

function __disable_follow_buttons() {
    controller.action("property", { "group":"btn.follow", "properties":"enabled=no" });
}

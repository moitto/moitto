var account = require("account");
var global  = account.global;

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_USER.DETAILS");

    global.get_user(value["username"]).then(function(user) {
        account.is_following(value["username"], function(username, following) {
            account.is_muted(value["username"], function(username, muted) {
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
                    "is-following":following ? "yes" : "no",
                    "is-muted":muted ? "yes" : "no",
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
                });

                view.data("display-unit", data);
                view.action("reload");            
            });
        });
    });
}

function follow() {
}

function unfollow() {
}

function mute() {
}

function unmute() {
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

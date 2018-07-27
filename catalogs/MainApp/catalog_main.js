var account  = require("account");
var history  = require("history");
var notif    = require("notif");
var connect  = require("connect");
var settings = require("settings");
var steemjs  = require("steemjs");
var global   = require("global");
var contents = require("contents");
var users    = require("users");

var __last_background_time = new Date().getTime();

function on_loaded() {
    if (storage.value("HAS_NEW_NOTIF")) {
        __show_notif_badge();
    }

    if (account.is_logged_in()) {
        update_notif();
    }
}

function on_foreground() {
    if (__reaches_refresh_interval()) {
        __reload_subviews([ "V_HOME", "V_TREND" ]);
    }

    if (account.is_logged_in()) {
        update_notif();
    }
}

function on_background() {
    __last_background_time = new Date().getTime();
}

function on_connect(form) {
    connect.invoke(form["method"], form);
}

function update_notif() {
    if (!history.is_updating()) {
        history.update(function(username, history) {
            if (notif.update(username, history)) {
                controller.action("reload", { "subview":"V_NOTIF" });
                storage.value("HAS_NEW_NOTIF", true);

                __show_notif_badge();
            }
        }); 
    }
}

function reset_notif() {
    storage.value("HAS_NEW_NOTIF", false);

    __hide_notif_badge();
}

function snooze_notif() {
    storage.value("HAS_NEW_NOTIF", false);

    __hide_notif_badge();
}

function vote(params) {
    account.vote(params["author"], params["permlink"], parseInt(params["weight"]), function(response) {
        if (response) {
            __get_content(params["author"], params["permlink"], function(content) {
                var reblogged = (content.data["reblogged_by"].length > 0) ? true : false;
                var me = account.get_username();

                if (parseInt(params["weight"]) == 0) {
                    controller.action("toast", { "message":"보팅이 취소되었습니다." });
                } else {
                    controller.action("toast", { "message":"보팅이 완료되었습니다." });
                }
                controller.update("content-" + content.data["author"] + "." + content.data["permlink"], {
                    "votes-count":content.data["net_votes"].toString(),
                    "vote-weight":content.get_vote_weight(me).toString(),
                    "replies-count":content.data["children"].toString(),
                    "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                    "is-payout":content.is_payout() ? "yes" : "no",
                    "reblogged":reblogged ? "yes" : "no",
                    "reblogged-by":reblogged ? content.data["reblogged_by"][0] : "",
                    "reblogged-count":content.data["reblogged_by"].length.toString(),
                    "reblogged-count-1":(content.data["reblogged_by"].length - 1).toString()
                });
            });
        } else {
            controller.action("toast", { "message":"보팅에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"보팅을 진행합니다." });
}

function reblog(params) {
    account.reblog(params["author"], params["permlink"], function(response) {
        if (response) {
            __get_content(params["author"], params["permlink"], function(content) {
                var reblogged = (content.data["reblogged_by"].length > 0) ? true : false;
                var me = account.get_username();

                controller.action("toast", { "message":"리블로그 되었습니다." });
                controller.update("content-" + content.data["author"] + "." + content.data["permlink"], {
                    "votes-count":content.data["net_votes"].toString(),
                    "vote-weight":content.get_vote_weight(me).toString(),
                    "replies-count":content.data["children"].toString(),
                    "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                    "is-payout":content.is_payout() ? "yes" : "no",
                    "reblogged":reblogged ? "yes" : "no",
                    "reblogged-by":reblogged ? content.data["reblogged_by"][0] : "",
                    "reblogged-count":content.data["reblogged_by"].length.toString(),
                    "reblogged-count-1":(content.data["reblogged_by"].length - 1).toString()
                });
            });
        } else {
            controller.action("toast", { "message":"리블로그에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"리블로그를 진행합니다." });
}

function follow(params) {
    account.follow_user(params["username"], function(response) {
        if (response) {
            __get_user(params["username"], function(user, follows, muted) {
                controller.action("toast", { "message":"팔로우가 완료되었습니다." });
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
            });
        } else {
            controller.action("toast", { "message":"팔로우에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"팔로우를 진행합니다." });
}

function unfollow(params) {
    account.unfollow_user(params["username"], function(response) {
        if (response) {
            __get_user(params["username"], function(user, follows, muted) {
                controller.action("toast", { "message":"언팔로우가 완료되었습니다." });
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
            });
        } else {
            controller.action("toast", { "message":"언팔로우에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"언팔로우를 진행합니다." });
}

function mute(params) {
    account.mute_user(params["username"], function(response) {
        if (response) {
            __get_user(params["username"], function(user, follows, muted) {
                controller.action("toast", { "message":"뮤트가 완료되었습니다." });
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
            });
        } else {
            controller.action("toast", { "message":"뮤트에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"뮤트를 진행합니다." });
}

function unmute(params) {
    account.unmute_user(params["username"], function(response) {
        if (response) {
            __get_user(params["username"], function(user, follows, muted) {
                controller.action("toast", { "message":"언뮤트가 완료되었습니다." });
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
            });
        } else {
            controller.action("toast", { "message":"언뮤트에 실패했습니다." });
        }
    });

    controller.action("toast", { "message":"언뮤트를 진행합니다." });
}

function __get_content(author, permlink, handler) {
    steemjs.get_content(author, permlink).then(function(response) {
        if (response) {
            handler(contents.create(response));
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    }); 
}

function __get_user(username, handler) {
    var me = account.get_username();

    Promise.all([
        steemjs.get_accounts([ username ]),
        steemjs.get_follow_count(username),
        steemjs.get_dynamic_global_properties(),
        steemjs.get_followers(username, me, "blog", 1),
        steemjs.get_followers(username, me, "ignore", 1)
    ]).then(function(response) {
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

function __reaches_refresh_interval() {
    var refresh_interval = settings.get_refresh_interval();
    var interval = new Date().getTime() - __last_background_time;

    if (interval > refresh_interval) {
        return true;
    }

    return false;
}

function __reload_subviews(subviews) {
    subviews.forEach(function(subview) {
        controller.action("reload", { "target":"catalog", "subview":subview });
    });
}

function __show_notif_badge() {
    var blank = view.object("blank.notif.badge");

    blank.action("show");
}

function __hide_notif_badge() {
    var blank = view.object("blank.notif.badge");

    blank.action("hide");
}


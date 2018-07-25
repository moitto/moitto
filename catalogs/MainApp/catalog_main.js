var account  = require("account");
var history  = require("history");
var notif    = require("notif");
var connect  = require("connect");
var settings = require("settings");

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

function vote() {
    var value = document.value("VOTE");

    account.vote(value["author"], value["permlink"], value["weight"], function(response) {
        if (response) {
            account.global.get_content(value["author"], value["permlink"]).then(function(content) {
                var reblogged = (content.data["reblogged_by"].length > 0) ? true : false;
                var me = account.get_username();

                if (value["weight"] == 0) {
                    controller.action("toast", { "message":"보팅이 취소되었습니다." });
                } else {
                    controller.action("toast", { "message":"보팅이 완료되었습니다." });
                }
                controller.update("content-" + content.data["author"] + "." + content.data["permlink"], {
                    "votes-count":content.data["net_votes"].toString(),
                    "replies-count":content.data["children"].toString(),
                    "vote-weight":content.get_vote_weight(me).toString(),
                    "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
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

    controller.action("toast", { "message":"보팅을 요청합니다." });
}

function reblog() {
    var value = document.value("REBLOG");

    account.reblog(value["author"], value["permlink"], function(response) {
        if (response) {
            account.global.get_content(value["author"], value["permlink"]).then(function(content) {
                var reblogged = (content.data["reblogged_by"].length > 0) ? true : false;
                var me = account.get_username();

                controller.action("toast", { "message":"리블로그 되었습니다." });
                controller.update("content-" + content.data["author"] + "." + content.data["permlink"], {
                    "votes-count":content.data["net_votes"].toString(),
                    "replies-count":content.data["children"].toString(),
                    "vote-weight":content.get_vote_weight(me).toString(),
                    "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
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

    controller.action("toast", { "message":"리블로그를 요청합니다." });
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


var history = require("history");
var notif   = require("notif");
var connect = require("connect");
var account = require("account");

function on_loaded() {
    if (storage.value("HAS_NEW_NOTIF")) {
        __show_notif_badge();
    }

    if (account.is_logged_in()) {
        update_notif();
    }
}

function on_foreground() {
    if (account.is_logged_in()) {
        update_notif();
    }
}

function on_connect(form) {
    connect.invoke(form["method"], form);
}

function update_notif() {
    if (!notif.is_updating()) {
        notif.update().then(function(history) {
            if (history.length > 0) {
                controller.action("reload", { "subview":"V_NOTIF" });
                storage.value("HAS_NEW_NOTIF", true);

                __show_notif_badge();
            }
        });
    }

    history.update(function(history) {

    });
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
            if (value["weight"] == 0) {
                controller.action("toast", { "message":"보팅이 취소되었습니다." });
            } else {
                controller.action("toast", { "message":"보팅이 완료되었습니다." });
            }
            controller.action("script", { "script":"on_finish_vote", "subview":value["subview"] })
        } else {
            controller.action("toast", { "message":"보팅에 실패했습니다." });
            controller.action("script", { "script":"on_fail_vote", "subview":value["subview"] })
        }
    });

    controller.action("script", { "script":"on_start_vote", "subview":value["subview"] })
}

function reblog() {
    var value = document.value("REBLOG");

    account.reblog(value["author"], value["permlink"], function(response) {
        if (response) {
            controller.action("toast", { "message":"리블로그 되었습니다." });
        } else {
            controller.action("toast", { "message":"리블로그에 실패했습니다." });
        }
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

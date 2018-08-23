var history  = require("history");
var notif    = require("notif");
var settings = require("settings");
var actions  = require("actions");
var api      = require("api");

var __last_background_time = new Date().getTime();

function on_loaded() {
    if (storage.value("HAS_NEW_NOTIF")) {
        __show_notif_badge();
    }

    if (storage.value("ACTIVE_USER")) {
        update_notif();
    }
}

function on_foreground() {
    if (__reaches_refresh_interval()) {
        __reload_subviews([ "V_HOME", "V_TREND" ]);
    }

    if (storage.value("ACTIVE_USER")) {
        update_notif();
    }
}

function on_background() {
    __last_background_time = new Date().getTime();
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

//export([
    //"api.vote",
    //"api.reblog",
    //"api.follow",
    //"api.unfollow",
    //"api.mute",
    //"api.unmute",
    //"api.transfer",
    //"api.delegate",
    //"api.power_up",
    //"api.power_down"
//]);

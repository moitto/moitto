var notif   = require("notif");
var connect = require("connect"); 

function on_loaded() {
    if (storage.value("HAS_NEW_NOTIF")) {
        __show_notif_badge();
    }

    update_notif();
}

function on_foreground() {
    update_notif();
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
}

function snooze_notif() {
    storage.value("HAS_NEW_NOTIF", false);

    __hide_notif_badge();
}

function __show_notif_badge() {
    var blank = view.object("blank.notif.badge");

    blank.action("show");
}

function __hide_notif_badge() {
    var blank = view.object("blank.notif.badge");

    blank.action("hide");
}

var notif   = require("notif");
var connect = require("connect"); 

function on_loaded() {
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
            }
        });
    }
}

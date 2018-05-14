var notif = require("notif");

function on_loaded() {
	if (!notif.is_updating()) {
		notif.update().then(function() {
            __reload_notif();
        });
	}
}

function on_foreground() {
	if (!notif.is_updating()) {
		notif.update().then(function() {
            __reload_notif();
        });
	}
}

function __reload_notif() {
    controller.action("reload", { "subview":"V_NOTIF" });
}

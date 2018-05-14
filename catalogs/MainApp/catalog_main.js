var notif = require("notif");

function on_loaded() {
	if (!notif.is_updating()) {
		notif.update();
	}
}

function on_foreground() {
	if (!notif.is_updating()) {
		notif.update();
	}
}

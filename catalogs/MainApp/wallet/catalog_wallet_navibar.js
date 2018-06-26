var account = require("account");

function qrcode() {
    controller.catalog().submit("showcase", "auxiliary", "S_QRCODE", {
        "logged-in":account.is_logged_in() ? "yes" : "no"
    });
    controller.action("popup", { "display-unit":"S_QRCODE" });
}

function show_settings() {
	controller.catalog().submit("showcase", "auxiliary", "S_ACCOUNT", {
		"logged-in":account.is_logged_in() ? "yes" : "no"
	});
	
	controller.action("subview", { "subview":"V_SETTINGS",
								   "target":"popup" });
}
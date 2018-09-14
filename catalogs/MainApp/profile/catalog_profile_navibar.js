function qrcode() {
    controller.catalog().submit("showcase", "auxiliary", "S_QRCODE", {
        "logged-in":storage.value("ACTIVE_USER") ? "yes" : "no"
    });
    
    controller.action("popup", { "display-unit":"S_QRCODE" });
}

function show_settings() {
	controller.catalog().submit("showcase", "auxiliary", "S_SETTINGS", {
		"logged-in":storage.value("ACTIVE_USER") ? "yes" : "no"
	});

	controller.action("subview", { "subview":"V_SETTINGS", "target":"popup" });
}

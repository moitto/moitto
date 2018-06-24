var account = require("account");

function qrcode() {
    controller.catalog().submit("showcase", "auxiliary", "S_QRCODE", {
        "logged-in":account.is_logged_in() ? "yes" : "no"
    });
    controller.action("popup", { "display-unit":"S_QRCODE" });
}

var connect = require("connect");

function on_qrcode(params) {
    if (connect.handle_url(params["text"])) {
        controller.action("popup-close");

        return;
    }
}

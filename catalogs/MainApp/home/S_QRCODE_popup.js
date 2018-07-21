var connect = require("connect");
var users   = require("users");

function on_qrcode(params) {
    if (connect.handle_url(params["text"])) {
        controller.action("popup-close");

        return;
    }
}

function show_transfer_qrcode() {
    var username = storage.value("ACTIVE_USER");
    var user = users.create(username);

    controller.catalog().submit("showcase", "auxiliary", "S_QRCODE.TRANSFER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "userpic-large-url":user.get_userpic_url()   
    });

    controller.action("popup", { "display-unit":"S_QRCODE.TRANSFER" });
}

function show_follow_qrcode() {
    var username = storage.value("ACTIVE_USER");
    var user = users.create(username);

    controller.catalog().submit("showcase", "auxiliary", "S_QRCODE.FOLLOW", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "userpic-large-url":user.get_userpic_url()   
    });

    controller.action("popup", { "display-unit":"S_QRCODE.FOLLOW" });
}

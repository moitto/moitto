function on_qrcode(params) {
    controller.action("popup-close");
    controller.action("alert", {message:params["text"]});
}

function choose_coin() {
    document.value("WALLET.AMOUNT.TYPE", $data["coin"]);
    controller.action("popup-close");
}

function choose_currency() {
    document.value("WALLET.AMOUNT.TYPE", $data["currency"]);
    controller.action("popup-close");
}

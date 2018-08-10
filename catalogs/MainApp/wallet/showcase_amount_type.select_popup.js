function choose_coin() {
    host.action("script", {
        "script":"on_choose_amount_type",
        "amount-type":$data["coin"],
        "close-popup":"yes"
    });
}

function choose_currency() {
    host.action("script", {
        "script":"on_choose_amount_type",
        "amount-type":$data["currency"],
        "close-popup":"yes"
    });
}

function transfer() {
    var amount_type = storage.value("STEEM.AMOUNT-TYPE") || "STEEM";

    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", {
        "amount-type":amount_type,
        "coin":"STEEM",
        "currency":"KRW"
    });

    controller.action("popup", { 
        "display-unit":"S_TRANSFER", 
        "alternate-name":"transfer.receiver.select" 
    });
}

function power_up() {
    controller.action("subview", { 
        "subview":"V_POWER_UP",
        "target":"popup",
        "close-popup":"yes"
    });
}

function transfer() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", {
        "amount-type":value["amount-type"] || "STEEM",
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
        "subview":"V_POWER.UP", 
        "target":"popup",
        "close-popup":"yes"
    });
}

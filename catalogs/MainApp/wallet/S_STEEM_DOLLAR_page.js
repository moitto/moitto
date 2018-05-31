function transfer() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", {
        "amount-type":value["amount-type"] || "SBD",
        "coin":"SBD",
        "currency":"KRW"
    });

    controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
        "message":"암호가 일치하면 0.001 SBD를 송금합니다."
    });

    controller.action("popup", { 
        "display-unit":"S_PIN", 
        "-display-unit":"S_TRANSFER", 
        "-alternate-name":"transfer.receivers" 
    });
}

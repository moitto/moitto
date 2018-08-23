function transfer() {
    var amount_type = storage.value("SBD.AMOUNT-TYPE") || "SBD";

    if (parseFloat($data["amount"]) == 0.0) {
        controller.action("toast", { 
            "message":"송금할 스팀달러의 잔고가 부족합니다.",
            "close-popup":"yes"
        });

        return;
    }

    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", {
        "amount-type":amount_type,
        "coin":"SBD",
        "currency":"KRW"
    });

    controller.action("popup", { 
        "display-unit":"S_TRANSFER", 
        "alternate-name":"transfer.receiver.select" 
    });
}

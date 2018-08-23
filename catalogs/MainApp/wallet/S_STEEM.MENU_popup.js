function transfer() {
    var amount_type = storage.value("STEEM.AMOUNT-TYPE") || "STEEM";

    if (parseFloat($data["amount"]) == 0.0) {
        controller.action("toast", { 
            "message":"송금할 스팀의 잔고가 부족합니다.",
            "close-popup":"yes"
        });

        return;
    }

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
    if (parseFloat($data["amount"]) == 0.0) {
        controller.action("toast", { 
            "message":"파워업할 스팀의 잔고가 부족합니다.",
            "close-popup":"yes"
        });

        return;
    }

    controller.catalog().submit("showcase", "auxiliary", "S_POWER_UP", {
        "coin":"STEEM"
    });

    controller.action("subview", { 
        "subview":"V_POWER_UP",
        "target":"popup",
        "close-popup":"yes"
    });
}

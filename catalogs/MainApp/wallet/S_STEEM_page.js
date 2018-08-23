function transfer() {
    var amount_type = storage.value("STEEM.AMOUNT-TYPE") || "STEEM";

    if (parseFloat($data["amount"]) == 0.0) {
        controller.action("toast", { 
            "message":"송금할 스팀의 잔고가 부족합니다."
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

function on_change_data(id, data) {
    view.data("display-unit", { "amount":data["steem-balance"] });
    view.action("reload");
}

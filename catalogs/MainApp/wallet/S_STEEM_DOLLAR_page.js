function transfer() {
    var amount_type = storage.value("SBD.AMOUNT-TYPE") || "SBD";

    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", {
        "amount-type":amount_type,
        "coin":"SBD",
        "currency":"KRW"
    });

    controller.action("popup", { 
        "display-unit":"S_TRANSFER", 
        "alternate-name":"transfer.receiver.select",
        "has-own-sbml":"no"
    });
}

function on_change_data(id, data) {
    view.data("display-unit", { "amount":data["sbd-balance"] });
    view.action("reload");
}

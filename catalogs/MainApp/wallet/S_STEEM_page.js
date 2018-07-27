var wallet = require("wallet");

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

function on_change_data(data) {
    var value = wallet.get_assets_data();

    view.data("display-unit", { "amount":value["steem-balance"] });
    view.action("reload");
}

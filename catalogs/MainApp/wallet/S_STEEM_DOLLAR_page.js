var global = require("global");
var wallet = require("wallet");

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

function update_assets() {
    var me = storage.value("ACTIVE_USER") || "";

    global.get_user(me).then(function(user) {
        wallet.update_assets_data(user);
        document.value("WALLET.ASSETS_CHANGED", true);

        __reload_data();
    });
}

function __reload_data() {
    var value = wallet.get_assets_data();

    view.data("display-unit", { "amount":value["sbd-balance"] });
    view.action("reload");
}

var wallet = require("wallet");
var global = wallet.account.global;

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

function update_assets() {
    var username = storage.value("ACTIVE_USER");
    
    global.get_user(username).then(function(user) {
        wallet.update_assets_data(user);
        document.value("WALLET.ASSETS_CHANGED", true);

        __reload_data();
    });
}

function __reload_data() {
    var value = wallet.get_assets_data();

    view.data("display-unit", { "amount":value["steem-balance"] });
    view.action("reload");
}

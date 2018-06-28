var global = require("global");
var wallet = require("wallet");

function delegate() {
    controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE", {
        // TBD
    });

    controller.action("popup", { 
        "display-unit":"S_DELEGATE", 
        "alternate-name":"delegate.receiver.select" 
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

    view.data("display-unit", { "amount":value["steem-power"] });
    view.action("reload");
}

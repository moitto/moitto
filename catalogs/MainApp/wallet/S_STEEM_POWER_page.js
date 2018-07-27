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

function on_change_data(data) {
    var value = wallet.get_assets_data();

    view.data("display-unit", { "amount":value["steem-power"] });
    view.action("reload");
}

function on_change_data(id, data) {
    __reload_assets_showcase_header();  
}

function feed_assets(keyword, location, length, sortkey, sortorder, handler) {
    var values = controller.catalog().value("showcase", "auxiliary", "S_WALLET_ASSETS");
    var assets = [];
 
    assets.push(__asset_data("S_STEEM",        "STEEM",        values["steem-balance"]));
    assets.push(__asset_data("S_STEEM_POWER",  "STEEM POWER",  values["steem-power"  ]));
    assets.push(__asset_data("S_STEEM_DOLLAR", "STEEM DOLLAR", values["sbd-balance"  ]));

    handler(assets);
}

function redeem_rewards() {
    controller.action("script", {
        "script":"actions.redeem_rewards",
        "subview":"__MAIN__"
    });
}

function __reload_assets_showcase_header() {
    var showcase = view.object("showcase.assets");

    showcase.action("reload-header");
}

function __asset_data(id, title, amount) {
    return {
        "id":id,
        "title":title,
        "amount":amount.toString(),
        "has-own-title":"yes",
        "has-own-sbml":"yes",
        "has-own-navibar":"yes"
    }
}

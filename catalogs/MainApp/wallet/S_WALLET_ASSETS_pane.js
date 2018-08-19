var __has_rewards = null;

function on_loaded() {
    __has_rewards = $data["has-rewards"];
}

function on_change_data(id, data) {
    if (data["has-rewards"] !== __has_rewards) {
        __reload_assets_showcase_header();
    }

    __has_rewards = data["has-rewards"];
}

function feed_assets(keyword, location, length, sortkey, sortorder, handler) {
    var assets = [];
 
    assets.push(__asset_data("S_STEEM",        "STEEM",        $data["steem-balance"]));
    assets.push(__asset_data("S_STEEM_POWER",  "STEEM POWER",  $data["steem-power"  ]));
    assets.push(__asset_data("S_STEEM_DOLLAR", "STEEM DOLLAR", $data["sbd-balance"  ]));

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

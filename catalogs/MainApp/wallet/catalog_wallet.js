var wallet  = require("wallet");
var account = wallet.account;
var global  = account.global;

var __is_updating = false;

function on_loaded() {
    if (!account.is_logged_in()) {
        __hide_loading_section();
        __show_login_section();
        
        return;
    }

    global.get_user(account.get_username()).then(function(user) {
        wallet.update_account_data(user);
        wallet.update_assets_data(user);

        __reload_assets_showcase();

        if (user.has_rewards()) {
            __reload_assets_showcase_header();
        }

        __hide_loading_section();
        __show_assets_showcase();

        __is_updating = false;
    });

    __is_updating = true;
}

function update_wallet() {
    if (!__is_updating) {
        global.get_user(account.get_username()).then(function(user) {
            if (wallet.is_assets_changed(user)) {
                wallet.update_assets_data(user);

                __reload_assets_showcase();
            }

            if (wallet.is_rewards_changed(user)) {
                wallet.update_account_data(user);

                __reload_assets_showcase_header();
            }

            __is_updating = false;
        });

        __is_updating = true;
    }

    if (document.value("WALLET.ASSETS_CHANGED")) {
        __reload_assets_showcase();

        document.value("WALLET.ASSETS_CHANGED", false);
    }

    if (document.value("WALLET.REWARDS_CHANGED")) {
        __reload_assets_showcase_header();

        document.value("WALLET.REWARDS_CHANGED", false);
    }
}

function feed_assets(keyword, location, length, sortkey, sortorder, handler) {
    var values = wallet.get_assets_data();
    var assets = [
        {
            "id":"S_STEEM",
            "title":"STEEM",
            "amount":__safe_value(values, "steem-balance"),
            "has-own-title":"yes",
            "has-own-sbml":"yes",
            "has-own-navibar":"yes"
        },
        {
            "id":"S_STEEM_POWER",
            "title":"STEEM POWER",
            "amount":__safe_value(values, "steem-power"),
            "has-own-title":"yes",
            "has-own-sbml":"yes",
            "has-own-navibar":"yes"
        },
        {
            "id":"S_STEEM_DOLLAR",
            "title":"STEEM DOLLAR",
            "amount":__safe_value(values, "sbd-balance"),
            "has-own-title":"yes",
            "has-own-sbml":"yes",
            "has-own-navibar":"yes"
        }
    ];

    handler(assets);
}

function redeem_rewards() {
    wallet.redeem_rewards(function(response) {
        update_wallet();
    });
}

function __reload_assets_showcase() {
    var showcase = view.object("showcase.assets");

    showcase.action("reload");
}

function __reload_assets_showcase_header() {
    var showcase = view.object("showcase.assets");

    showcase.action("reload-header");
}

function __show_assets_showcase() {
    var showcase = view.object("showcase.assets");

    showcase.action("show");
}

function __show_login_section() {
    var section = view.object("section.login");

    section.action("show");
}

function __hide_loading_section() {
    var section = view.object("section.loading");

    section.action("hide");
}

function __calculate_reputation(reputation) {
    return (Math.log10(reputation) - 9) * 9 + 25;
}

function __safe_value(values, property) {
    if (values && values.hasOwnProperty(property)) {
        return values[property];
    }

    return "";
}

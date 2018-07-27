var wallet  = require("wallet");
var account = require("account");
var steemjs = require("steemjs");
var global  = require("global");
var users   = require("users");

var __is_updating = false;

function on_loaded() {
    if (!account.is_logged_in()) {
        __hide_loading_section();
        __show_login_section();
        
        return;
    }

    __get_user(account.get_username(), function(user) {
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

function on_change_data(data) {
    __reload_assets_showcase();
}

function update_wallet() {
    if (!__is_updating) {
        __get_user(account.get_username(), function(user) {
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
    var assets = [];
 
    assets.push(__asset_data("S_STEEM",        "STEEM",        values["steem-balance"]));
    assets.push(__asset_data("S_STEEM_POWER",  "STEEM POWER",  values["steem-power"  ]));
    assets.push(__asset_data("S_STEEM_DOLLAR", "STEEM DOLLAR", values["sbd-balance"  ]));

    handler(assets);
}

function redeem_rewards() {
    wallet.redeem_rewards(function(response) {
        update_wallet();
    });
}

function __get_user(username, handler) {
    Promise.all([
        steemjs.get_accounts([ username ]),
        steemjs.get_follow_count(username),
        steemjs.get_dynamic_global_properties()
    ]).then(function(response) {
        if (response[0][0]) {
            handler(users.create(username, response[0][0], response[1], global.create(response[2])))
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
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


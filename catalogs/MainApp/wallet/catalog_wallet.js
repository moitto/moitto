var account = require("account");
var wallet  = require("wallet");
var global  = require("global");

var __is_updating = false;

function on_loaded() {
    if (!account.is_logged_in()) {
        __hide_loading_section();
        __show_login_section();
        
        return;
    }

    global.get_user(account.get_username()).then(function(user) {
        __update_wallet_data(user);
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
            if (__is_rewards_changed(user) || __is_assets_changed(user)) {
                __update_wallet_data(user);

                __reload_assets_showcase();
                __reload_assets_showcase_header();
            }

            __is_updating = false;
        });

        __is_updating = true;
    }
}

function feed_assets(keyword, location, length, sortkey, sortorder, handler) {
    var values = controller.catalog().value("showcase", "auxiliary", "S_WALLET.ASSETS");
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
        __reload_assets_showcase_header();
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

function __update_wallet_data(user) {
    controller.catalog().submit("showcase", "auxiliary", "S_WALLET.ACCOUNT", {
        "username":user.name,
        "reputation":user.get_reputation().toFixed(1).toString(),
        "post-count":user.get_post_count().toString(),
        "following-count":user.get_following_count().toString(),
        "follower-count":user.get_follower_count().toString(),
        "reward-steem-balance":user.get_reward_steem_balance().toFixed(3).toString(),
        "reward-steem-power":user.get_reward_steem_power().toFixed(3).toString(),
        "reward-sbd-balance":user.get_reward_sbd_balance().toFixed(3).toString(),
        "has-rewards":user.has_rewards() ? "yes" : "no"
    });

    controller.catalog().submit("showcase", "auxiliary", "S_WALLET.ASSETS", {
        "steem-balance":user.get_steem_balance().toFixed(3).toString(),
        "steem-power":user.get_steem_power().toFixed(3).toString(),
        "sbd-balance":user.get_sbd_balance().toFixed(3).toString()
    });
}

function __is_rewards_changed(user) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_WALLET.ACCOUNT");

    if (parseFloat(value["reward-steem-balance"]) != user.get_reward_steem_balance().toFixed(3)) {
        return true;
    }

    if (parseFloat(value["reward-steem-power"]) != user.get_reward_steem_power().toFixed(3)) {
        return true;
    }

    if (parseFloat(value["reward-sbd-balance"]) != user.get_reward_sbd_balance().toFixed(3)) {
        return true;
    }

    return false;
}

function __is_assets_changed(user) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_WALLET.ASSETS");

    if (parseFloat(value["steem-balance"]) != user.get_steem_balance().toFixed(3)) {
        return true;
    }

    if (parseFloat(value["steem-power"]) != user.get_steem_power().toFixed(3)) {
        return true;
    }

    if (parseFloat(value["sbd-balance"]) != user.get_sbd_balance().toFixed(3)) {
        return true;
    }

    return false;
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

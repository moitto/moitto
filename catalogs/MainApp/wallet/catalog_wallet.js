var wallet  = require("wallet");
var steemjs = require("steemjs");
var global  = require("global");
var users   = require("users");
var account = require("account");

var __is_updating = false;

function on_loaded() {
    if (storage.value("ACTIVE_USER")) {
        var me = storage.value("ACTIVE_USER") || "";

        __get_user(me, function(user) {
            __update_account_data(__account_data_for_user(user));
            __update_rewards_data(__rewards_data_for_user(user));
            __update_assets_data(__assets_data_for_user(user));

            __reload_assets_showcase();

            if (user.has_rewards()) {
                __reload_assets_showcase_header();
            }

            __hide_loading_section();
            __show_assets_showcase();

            __is_updating = false;
        });

        __is_updating = true;
    } else {
        __hide_loading_section();
        __show_login_section();
    }
}

function on_change_data(data) {
    if (!__is_updating) {
        if (data["data-binding"] === "assets") {
            var assets_data = __assets_data_for_value(data);

            if (__is_assets_changed(assets_data)) {
                __update_assets_data(assets_data);

                // do not reload the assets showcase
            }

            var rewards_data = __rewards_data_for_value(data);

            if (__is_rewards_changed(rewards_data)) {
                __update_rewards_data(rewards_data);
        
                __reload_assets_showcase_header();
            }
        }
    }
}

function update_wallet() {
    if (storage.value("ACTIVE_USER") && !__is_updating) {
        var me = storage.value("ACTIVE_USER") || "";

        __get_user(me, function(user) {
            var assets_data = __assets_data_for_user(user);

            if (__is_assets_changed(assets_data)) {
                __update_assets_data(assets_data);

                __reload_assets_showcase();
            }

            var rewards_data = __rewards_data_for_user(user);

            if (__is_rewards_changed(rewards_data)) {
                __update_rewards_data(rewards_data);
        
                __reload_assets_showcase_header();
            }

            __is_updating = false;
        });

        __is_updating = true;
    }
}

function feed_assets(keyword, location, length, sortkey, sortorder, handler) {
    var values = controller.catalog().value("showcase", "auxiliary", "S_WALLET.ASSETS");
    var assets = [];
 
    assets.push(__asset_data("S_STEEM",        "STEEM",        values["steem-balance"]));
    assets.push(__asset_data("S_STEEM_POWER",  "STEEM POWER",  values["steem-power"  ]));
    assets.push(__asset_data("S_STEEM_DOLLAR", "STEEM DOLLAR", values["sbd-balance"  ]));

    handler(assets);
}

function redeem_rewards() {
    controller.action("script", {
        "script":"api.redeem_rewards",
        "subview":"__MAIN__"
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

function __update_account_data(data) {
    controller.catalog().submit("showcase", "auxiliary", "S_WALLET.ACCOUNT", {
        "username":data["username"],
        "userpic-url":data["userpic-url"],
        "userpic-large-url":data["userpic-large-url"], 
        "reputation":data["reputation"].toFixed(1).toString(),
        "auxiliary":"S_WALLET.REWARDS"
    });
}

function __account_data_for_user(user) {
    return {
        "username":user.name, 
        "userpic-url":user.get_userpic_url("small"),
        "userpic-large-url":user.get_userpic_url(), 
        "reputation":user.get_reputation()
    }
}

function __account_data_for_value(value) {
    return {
        "username":value["username"], 
        "userpic-url":value["userpic-url"], 
        "userpic-large-url":value["userpic-large-url"], 
        "reputation":parseFloat(value["reputation"])
    }
}

function __update_rewards_data(data) {
    controller.catalog().submit("showcase", "auxiliary", "S_WALLET.REWARDS", {
        "reward-steem-balance":data["reward-steem-balance"].toFixed(3),
        "reward-steem-power":data["reward-steem-power"].toFixed(3),
        "reward-sbd-balance":data["reward-sbd-balance"].toFixed(3),
        "has-rewards":data["has-rewards"]
    });
}

function __rewards_data_for_user(user) {
    return {
        "reward-steem-balance":user.get_reward_steem_balance(),
        "reward-steem-power":user.get_reward_steem_power(),
        "reward-sbd-balance":user.get_reward_sbd_balance(),
        "has-rewards":user.has_rewards() ? "yes" : "no"
    } 
}

function __rewards_data_for_value(value) {
    return {
        "reward-steem-balance":parseFloat(value["reward-steem-balance"]),
        "reward-steem-power":parseFloat(value["reward-steem-power"]),
        "reward-sbd-balance":parseFloat(value["reward-sbd-balance"]),
        "has-rewards":value["has-rewards"]
    }
}

function __update_assets_data(data) {
    controller.catalog().submit("showcase", "auxiliary", "S_WALLET.ASSETS", {
        "steem-balance":data["steem-balance"].toFixed(3),
        "steem-power":data["steem-power"].toFixed(3),
        "sbd-balance":data["sbd-balance"].toFixed(3)
    });
}

function __assets_data_for_user(user) {
    return {
        "steem-balance":user.get_steem_balance(),
        "steem-power":user.get_steem_power(),
        "sbd-balance":user.get_sbd_balance()
    } 
}

function __asset_data_for_value(value) {
    return {
        "steem-balance":parseFloat(value["steem-balance"]),
        "steem-power":parseFloat(value["steem-power"]),
        "sbd-balance":parseFloat(value["sbd-balance"])
    }
}

function __is_rewards_changed(data) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_WALLET.REWARDS");

    if (value["reward-steem-balance"] !== data["reward-steem-balance"].toFixed(3)) {
        return true;
    }

    if (value["reward-steem-power"] !== data["reward-steem-power"].toFixed(3)) {
        return true;
    }

    if (value["reward-sbd-balance"] !== data["reward-sbd-balance"].toFixed(3)) {
        return true;
    }

    return false;
}

function __is_assets_changed(data) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_WALLET.ASSETS");

    if (value["steem-balance"] !== data["steem-balance"].toFixed(3)) {
        return true;
    }

    if (value["steem-power"] !== data["steem-power"].toFixed(3)) {
        return true;
    }

    if (value["sbd-balance"] !== data["sbd-balance"].toFixed(3)) {
        return true;
    }

    return false;
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


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
            __update_account_data(user);
            __update_assets_data(user);

            __hide_loading_section();
            __show_wallet_panes();

            __is_updating = false;
        });

        __is_updating = true;
    } else {
        __hide_loading_section();
        __show_login_section();
    }
}

function on_resume() {
    if (storage.value("ACTIVE_USER") && !__is_updating) {
        var me = storage.value("ACTIVE_USER") || "";

        __get_user(me, function(user) {
            __update_account_data(user);
            __update_assets_data(user);

            __is_updating = false;
        });

        __is_updating = true;
    }
}

function feed_wallet(handler) {
    var me = storage.value("ACTIVE_USER") || "";
    var wallet = controller.catalog().values("collection", "wallet", me, null, [ 0, 100 ]);

    handler([{
        "id":"P_WALLET_ASSETS",
        "has-own-sbml":"yes"
    }].concat(wallet || []));
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

function __update_account_data(user) {
    var data = {
        "username":user.name, 
        "userpic-url":user.get_userpic_url("small"),
        "userpic-large-url":user.get_userpic_url(), 
        "reputation":user.get_reputation().toFixed(1).toString()
    }

    controller.catalog().submit("showcase", "auxiliary", "S_WALLET_ACCOUNT", data);
    controller.update("account", data);
}

function __update_assets_data(user) {
    var data = {
        "steem-balance":user.get_steem_balance().toFixed(3).toString(),
        "steem-power":user.get_steem_power().toFixed(3).toString(),
        "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
        "reward-steem-balance":user.get_reward_steem_balance().toFixed(3).toString(),
        "reward-steem-power":user.get_reward_steem_power().toFixed(3).toString(),
        "reward-sbd-balance":user.get_reward_sbd_balance().toFixed(3).toString(),
        "has-rewards":user.has_rewards() ? "yes" : "no"
    }

    controller.catalog().submit("showcase", "auxiliary", "S_WALLET_ASSETS", data);
    controller.update("assets", data);
}

function __show_login_section() {
    var section = view.object("section.login");

    section.action("show");
}

function __hide_loading_section() {
    var section = view.object("section.loading");

    section.action("hide");
}

function __show_wallet_panes() {
    var panes = view.object("panes.wallet");

    panes.action("show");
}


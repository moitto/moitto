var wallet  = require("wallet");
var steemjs = require("steemjs");
var global  = require("global");
var users   = require("users");

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
    var me = storage.value("ACTIVE_USER") || "";
    
    __get_user(me, function(user) {
        wallet.update_assets_data(user);
        document.value("WALLET.ASSETS_CHANGED", true);

        __reload_data();
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

function __reload_data() {
    var value = wallet.get_assets_data();

    view.data("display-unit", { "amount":value["steem-balance"] });
    view.action("reload");
}

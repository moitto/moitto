var steemjs = require("steemjs"); 
var global  = require("global");
var users   = require("users");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");

    __get_user(value["to"], function(user) {
        var data = undefined;

        if (user) {
            data = {
                "userpic-url":user.get_userpic_url(),
                "reputation":user.get_reputation().toFixed(1).toString(),
                "post-count":user.get_post_count().toString(),
                "following-count":user.get_following_count().toString(),
                "follower-count":user.get_follower_count().toString(),
                "steem-balance":user.get_steem_balance().toFixed(3).toString(),
                "steem-power":user.get_steem_power().toFixed(3).toString(),
                "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
                "fetched":"yes"
            };
        } else {
            data = {
                "fetched":"yes",
                "invalid":"yes"
            }
        }
        
        view.data("display-unit", data);
        view.action("reload");
    });
}

function transfer() {
    controller.action("subview", { 
        "subview":"V_TRANSFER", 
        "target":"popup",
        "close-popup":"yes"
    });
}

function cancel() {
    controller.action("popup", { 
        "display-unit":"S_TRANSFER", 
        "alternate-name":"transfer.receiver.select"
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

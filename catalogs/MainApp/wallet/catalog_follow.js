var account = require("account");
var users   = require("users");
var steemjs = require("steemjs");

var __last_label_for_follow_buttons = {};

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_FOLLOW");
    var username = value["following"];

    Promise.all([
        Global.steemjs.get_accounts([ username ]),
        Global.steemjs.get_followers(username, account.get_username(), "blog", 1)
    ]).then(function(response) {
        var user = users.create(username, response[0][0]);
        var followed = (response[1].length == 0 || response[1][0]["follower"] !== account.get_username()) ? false : true;
        
        controller.catalog().value("showcase", "auxiliary", "S_FOLLOW", Object.assign(value, {
            "userpic-url":user.get_userpic_url(),
            "reputation":user.get_reputation().toFixed(1).toString(),
            "followed":followed ? "yes" : "no" 
        });

        __hide_loading_section();
    }, function(reason) {
        // TBD       
    });
}

function __hide_loading_section() {
    var section = view.object("section.loading");

    section.action("hide");
}

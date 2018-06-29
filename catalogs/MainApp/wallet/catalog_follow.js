var account = require("account");
var users   = require("users");
var steemjs = require("steemjs");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_FOLLOW");
    var username = value["following"];

    Promise.all([
        Global.steemjs.get_accounts([ username ]),
        Global.steemjs.get_followers(username, account.get_username(), "blog", 1)
    ]).then(function(response) {
        var user = users.create(username, response[0][0]);
        var followed = (response[1].length == 0 || response[1][0]["follower"] !== account.get_username()) ? false : true;
 
        __reload_follow_cell({
            "username":username,
            "userpic-url":user.get_userpic_url(),
            "reputation":user.get_reputation().toFixed(1).toString(),
            "followed":followed ? "yes" : "no" 
        });

        __show_follow_cell();
        __hide_loading_section();
    }, function(reason) {
        // TBD
    });
}

function __reload_follow_cell(data) {
    var cell = view.object("cell.follow");

    cell.data("display-unit", data);
    cell.action("reload");
}

function __show_follow_cell() {
    var cell = view.object("cell.follow");

    cell.action("show");
}

function __hide_loading_section() {
    var section = view.object("section.loading");

    section.action("hide");
}

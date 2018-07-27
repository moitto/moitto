var account = require("account");
var steemjs = require("steemjs");
var users   = require("users");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_FOLLOW");

    __get_user(value["following"], function(user, follows) {
       __reload_follow_cell({
            "username":user.name,
            "userpic-url":user.get_userpic_url(),
            "reputation":user.get_reputation().toFixed(1).toString(),
            "follows":follows ? "yes" : "no" 
        });

        __show_follow_cell();
        __hide_loading_section();
    });
}

function __get_user(username, handler) {
    var me = storage.value("ACTIVE_USER") || "";

    Promise.all([
        steemjs.get_accounts([ username ]),
        steemjs.get_followers(username, me, "blog", 1)
    ]).then(function(response) {
        if (response[0][0]) {
            var user = users.create(username, response[0][0]);
            var follows = (response[1].length == 0 || response[1][0]["follower"] !== me) ? false : true;

            handler(user, follows);
        } else {
            handler();
        }
    }, function(reason) {
        handler();
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

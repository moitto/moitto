var account = require("account");
var steemjs = require("steemjs");
var users   = require("users");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_FOLLOWING");

    __get_user(value["following"], function(user, follows, muted) {
        if (user) {
            __reload_following_cell({
                "username":user.name,
                "userpic-url":user.get_userpic_url(),
                "reputation":user.get_reputation().toFixed(1).toString(),
                "is-me":(account.get_username() === user.name) ? "yes" : "no",
                "follows":follows ? "yes" : "no",
                "muted":muted ? "yes" : "no"
            });            
        }

        __show_following_cell();
        __hide_loading_section();
    });
}

function __get_user(username, handler) {
    var me = storage.value("ACTIVE_USER") || "";

    Promise.all([
        steemjs.get_accounts([ username ]),
        steemjs.get_followers(username, me, "blog", 1),
        steemjs.get_followers(username, me, "ignore", 1)
    ]).then(function(response) {
        if (response[0][0]) {
            var user = users.create(username, response[0][0]);
            var follows = (response[1].length == 0 || response[1][0]["follower"] !== me) ? false : true;
            var muted   = (response[2].length == 0 || response[2][0]["follower"] !== me) ? false : true;

            handler(user, follows, muted);
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });    
}

function __reload_following_cell(data) {
    var cell = view.object("cell.following");

    cell.data("display-unit", data);
    cell.action("reload");
}

function __show_following_cell() {
    var cell = view.object("cell.following");

    cell.action("show");
}

function __hide_loading_section() {
    var section = view.object("section.loading");

    section.action("hide");
}

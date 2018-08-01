var steemjs = require("steemjs");
var users   = require("users");

var __last_follower = null;

function feed_followers(keyword, location, length, sortkey, sortorder, handler) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_FOLLOWERS");
    var start_follower = (location > 0) ? __last_follower["follower"] : null;

    steemjs.get_followers(value["username"], start_follower, "blog", length + (start_follower ? 1 : 0)).then(function(followers) {
        var data = [];

        if (start_follower) {
            followers = followers.splice(1);
        }

        followers.forEach(function(follower) {
            var user = users.create(follower["follower"]);

            data.push({
                "id":"S_FOLLOWERS_" + value["username"] + "_" + user.name,
                "username":user.name,
                "userpic-url":user.get_userpic_url("small"),
                "userpic-large-url":user.get_userpic_url()
            });
        });

        if (followers.length > 0) {
            __last_follower = followers[followers.length - 1];
        }

        handler(data);    
    });
}

function show_user(data) {
    var user = users.create(data["username"]);

    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER", "target":"popup" })
}

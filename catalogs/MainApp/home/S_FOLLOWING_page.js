var steemjs = require("steemjs");
var users   = require("users");

var __last_following = null;

function feed_following(keyword, location, length, sortkey, sortorder, handler) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_FOLLOWING");
    var start_following = (location > 0) ? __last_following["following"] : null;

    steemjs.get_following(value["username"], start_following, "blog", length + (start_following ? 1 : 0)).then(function(followings) {
        var data = [];

        if (start_following) {
            followings = followings.splice(1);
        }

        followings.forEach(function(following) {
            var user = users.create(following["following"]);

            data.push({
                "id":"S_FOLLOWING_" + value["username"] + "_" + user.name,
                "username":user.name,
                "userpic-url":user.get_userpic_url("small"),
                "userpic-large-url":user.get_userpic_url()
            });
        });

        if (followings.length > 0) {
            __last_following = followings[followings.length - 1];
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

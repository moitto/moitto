var users = require("users");
var urls  = require("urls");

var __schedule_to_reload = false;

function on_download_image() {
    if (!__schedule_to_reload) {
        timeout(0.5, function() {
            view.action("reload", { "keeps-position":"yes" });

            __schedule_to_reload = false;
        });
    }

    __schedule_to_reload = true;
}

function show_user(params) {
    var user = users.create(params["username"]);

    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER", "target":"popup" })
}

function open_url(params) {
    var steem_url = urls.parse_steem_url(params["url"]);

    if (steem_url) {
        var user = users.create(steem_url[1]);

        if (steem_url[2]) {
            var backgrounds = controller.catalog("StyleBank").values("showcase", "backgrounds", "C_COLOR", null, [ 0, 1 ], [ null, "random" ]);
            var discussion = Object.assign(__background_data_for_value(backgrounds[0]), {
                "author":user.name,
                "permlink":steem_url[2],
                "userpic-url":user.get_userpic_url("small")
            });

            controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION", discussion);
            controller.action("page", { "display-unit":"S_DISCUSSION", "target":"popup" });                
        } else {
            controller.catalog().submit("showcase", "auxiliary", "S_USER", {
                "username":user.name,
                "userpic-url":user.get_userpic_url("small"),
                "fetched":"no"
            });

            controller.action("page", { "display-unit":"S_USER", "target":"popup" })
        }

        return;
    }

    controller.action("link", { url:params["url"] });
}

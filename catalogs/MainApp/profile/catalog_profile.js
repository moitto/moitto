var steemjs  = require("steemjs");
var global   = require("global");
var contents = require("contents");
var users    = require("users");

var __last_discussion = null;

function on_loaded() {
    if (storage.value("ACTIVE_USER")) {
        var me = storage.value("ACTIVE_USER") || "";

        __get_user(me, function(user) {
            __update_profile_data(user);

            __hide_loading_section();
            __show_blog_showcase();

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
            __update_profile_data(user);

            __is_updating = false;
        });

        __is_updating = true;
    }
}

function feed_blog(keyword, location, length, sortkey, sortorder, handler) {
    var me = storage.value("ACTIVE_USER") || "";
    var start_author   = (location > 0) ? __last_discussion["author"]   : null;
    var start_permlink = (location > 0) ? __last_discussion["permlink"] : null;

    if (me) {
        __get_discussions_by_blog(me, start_author, start_permlink, length, [], function(discussions) {
            var backgrounds = controller.catalog("StyleBank").values("showcase", "backgrounds", "C_COLOR", null, [ 0, 100 ]);
            var data = [];

            discussions.forEach(function(discussion) {
                var content = contents.create(discussion);
                var datum = {
                    "id":"S_BLOG_" + content.data["author"] + "_" + content.data["permlink"],
                    "author":content.data["author"],
                    "permlink":content.data["permlink"],
                    "title":content.data["title"], 
                    "image-url":content.get_title_image_url("256x512") || "",
                    "userpic-url":content.get_userpic_url("small"),
                    "userpic-large-url":content.get_userpic_url(),
                    "author-reputation":content.get_author_reputation().toFixed(0).toString(),
                    "votes-count":content.data["net_votes"].toString(),
                    "vote-weight":me ? content.get_vote_weight(me).toString() : "",
                    "replies-count":content.data["children"].toString(),
                    "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                    "payout-done":content.is_payout_done() ? "yes" : "no",
                    "payout-declined":content.is_payout_declined() ? "yes" : "no",
                    "editable":content.is_editable(me) ? "yes" : "no",
                    "deletable":content.is_deletable(me) ? "yes" : "no",
                    "main-tag":content.data["category"],
                    "created-at":content.data["created"]
                };

                datum = Object.assign(datum, __template_data_for_content(content));
                datum = Object.assign(datum, __random_background_data(backgrounds));

                data.push(datum);
            });

            if (discussions.length > 0) {
                __last_discussion = discussions[discussions.length - 1];
            }

            handler(data);
        });
    } else {
        handler([]);
    }
}

function open_discussion(data) {
    var discussion = __discussion_data_for_value(data);

    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION", discussion);
    controller.action("page", { "display-unit":"S_DISCUSSION", "target":"popup" });
}

function __show_login_section() {
    var section = view.object("section.login");

    section.action("show");
}

function __hide_loading_section() {
    var section = view.object("section.loading");

    section.action("hide");
}

function __show_blog_showcase() {
    var panes = view.object("showcase.blog");

    panes.action("show");
}

function __update_profile_data(user) {
    var data = {
        "username":user.name, 
        "userpic-url":user.get_userpic_url("small"),
        "userpic-large-url":user.get_userpic_url(), 
        "reputation":user.get_reputation().toFixed(1).toString(),
        "post-count":user.get_post_count().toString(),
        "following-count":user.get_following_count().toString(),
        "follower-count":user.get_follower_count().toString()
    }

    controller.catalog().submit("showcase", "auxiliary", "S_PROFILE", data);
    controller.update("account", data);
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

function __get_discussions_by_blog(username, start_author, start_permlink, length, discussions, handler) {
    console.log("__get_discussions_by_blog: started");
    steemjs.get_discussions_by_blog(username, start_author, start_permlink, length + (start_author ? 1 : 0)).then(function(response) {
    console.log("__get_discussions_by_blog: fetched");
        if (start_author && response.length > 0) {
            response = response.splice(1);
        }

        response.forEach(function(discussion) {
            if (discussion["author"] === username) {
                if (discussions.length < length) {
                   discussions.push(discussion);
                }
            }
        });

        if (discussions.length < length && response.length > 0) {
            start_author   = response[discussions.length - 1]["author"];
            start_permlink = response[discussions.length - 1]["permlink"];

            __get_discussions_by_blog(username, start_author, start_permlink, length, discussions, handler);

            return;
        }

        handler(discussions);
    });
}

function __template_data_for_content(content) {
    if ((content.meta["image"] || []).length == 0) {
        return {
            "template":"text"
        }
    }

    return {};
}

function __random_background_data(values) {
    var value = values[Math.floor(Math.random()*values.length)];
    var data = { "background":value["id"] };

    Object.keys(value).forEach(function(key) {
        data["background." + key] = value[key];
    });

    return data;
}

function __discussion_data_for_value(value) {
    var data = [];

    [ "author", "permlink", "userpic-url" ].forEach(function(key) {
        data[key] = value[key];
    });

    Object.keys(value).forEach(function(key) {
        if (key.startsWith("template") || key.startsWith("background")) {
            data[key] = value[key];
        }
    });

    return data;
}



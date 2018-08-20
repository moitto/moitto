var account  = require("account");
var steemjs  = require("steemjs");
var global   = require("global");
var contents = require("contents");
var users    = require("users");
var safety   = require("safety");

var __disallowed_tags = safety.get_disallowed_tags();

var __discussions = [];
var __last_discussion = null;

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_USER");

    __get_user(value["username"], function(user, follows, muted) {
        var data = {
            "username":user.name, 
            "userpic-url":user.get_userpic_url("small"),
            "userpic-large-url":user.get_userpic_url(),
            "reputation":user.get_reputation().toFixed(1).toString(),
            "post-count":user.get_post_count().toString(),
            "following-count":user.get_following_count().toString(),
            "follower-count":user.get_follower_count().toString(),
            "steem-balance":user.get_steem_balance().toFixed(3).toString(),
            "steem-power":user.get_steem_power().toFixed(3).toString(),
            "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
            "follows":follows ? "yes" : "no",
            "muted":muted ? "yes" : "no",
            "fetched":"yes"
        };

        controller.update("user-" + user.name, {
            "reputation":user.get_reputation().toFixed(1).toString(),
            "post-count":user.get_post_count().toString(),
            "following-count":user.get_following_count().toString(),
            "follower-count":user.get_follower_count().toString(),
            "steem-balance":user.get_steem_balance().toFixed(3).toString(),
            "steem-power":user.get_steem_power().toFixed(3).toString(),
            "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
            "follows":follows ? "yes" : "no",
            "muted":muted ? "yes" : "no"
        });

        view.data("display-unit", data);
        view.action("reload");
    });
}

function on_change_data(id, data) {
    __reload_showcase_header();
}

function feed_blog(keyword, location, length, sortkey, sortorder, handler) {
    var start_author   = (location > 0) ? __last_discussion["author"]   : null;
    var start_permlink = (location > 0) ? __last_discussion["permlink"] : null;

    __get_discussions_by_blog($data["username"], start_author, start_permlink, length, function(discussions) {
        var backgrounds = controller.catalog("StyleBank").values("showcase", "backgrounds", "C_COLOR", null, [ 0, 100 ]);
        var me = storage.value("ACTIVE_USER") || "";
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
                "hidable":(content.is_hidable(me) && !content.is_owner(me)) ? "yes" : "no",
                "main-tag":content.data["category"],
                "created-at":content.data["created"]
            };

            datum = Object.assign(datum, __template_data_for_content(content));
            datum = Object.assign(datum, __random_background_data(backgrounds));

            if (content.is_allowed(__disallowed_tags)) {
               data.push(datum);
            }
        });

        if (discussions.length > 0) {
            __last_discussion = discussions[discussions.length - 1];
        }

        handler(data);
    });        
}

function open_discussion(data) {
    var discussion = __discussion_data_for_value(data);

    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION", discussion);
    controller.action("page", { "display-unit":"S_DISCUSSION", "target":"popup" });
}

function __get_user(username, handler) {
    var me = storage.value("ACTIVE_USER") || "";
    
    Promise.all([
        steemjs.get_accounts([ username ]),
        steemjs.get_follow_count(username),
        steemjs.get_dynamic_global_properties(),
        steemjs.get_followers(username, me, "blog", 1),
        steemjs.get_followers(username, me, "ignore", 1)
    ]).then(function(response) {
        if (response[0][0]) {
            var user = users.create(username, response[0][0], response[1], global.create(response[2]));
            var follows = (response[3].length == 0 || response[3][0]["follower"] !== me) ? false : true;
            var muted   = (response[4].length == 0 || response[4][0]["follower"] !== me) ? false : true;

            handler(user, follows, muted);
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
}

function __get_discussions_by_blog(username, start_author, start_permlink, length, handler) {
    steemjs.get_discussions_by_blog(username, start_author, start_permlink, length + (start_author ? 1 : 0)).then(function(discussions) {
        if (start_author && discussions.length > 0) {
            discussions = discussions.splice(1);
        }

        discussions.forEach(function(discussion) {
            if (discussion["author"] === username) {
                if (__discussions.length < length) {
                   __discussions.push(discussion);
                }
            }
        });

        if (__discussions.length < length && discussions.length > 0) {
            start_author   = discussions[discussions.length - 1]["author"];
            start_permlink = discussions[discussions.length - 1]["permlink"];

            __get_discussions_by_blog(username, start_author, start_permlink, length, handler);

            return;
        }

        handler(__discussions);

        __discussions = [];
    });
}

function __reload_showcase_header() {
    var showcase = view.object("showcase.blog");

    showcase.action("reload-header");
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


var global   = require("global");
var steemjs  = global.steemjs;
var contents = global.contents;
var safety   = require("safety");

var __disallowed_tags = safety.get_disallowed_tags();

var __discussions = [];
var __last_discussion = null;

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_USER");

    global.get_user(value["username"]).then(function(user) {
        var data = {
            "username":user.name, 
        	"userpic-url":user.get_userpic_url(),
            "reputation":user.get_reputation().toFixed(1).toString(),
            "post-count":user.get_post_count().toString(),
            "following-count":user.get_following_count().toString(),
            "follower-count":user.get_follower_count().toString(),
            "steem-balance":user.get_steem_balance().toFixed(3).toString(),
            "steem-power":user.get_steem_power().toFixed(3).toString(),
            "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
            "is-following":"no",
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
        });

        view.data("display-unit", data);
        view.action("reload");
    });
}

function on_resume() {
}

function on_change_data(data) {
    __reload_showcase_header();
}

function feed_blog(keyword, location, length, sortkey, sortorder, handler) {
    var start_author   = (location > 0) ? __last_discussion["author"]   : null;
    var start_permlink = (location > 0) ? __last_discussion["permlink"] : null;

    __get_discussions_by_blog($data["username"], start_author, start_permlink, length, function(discussions) {
        var backgrounds = controller.catalog("ImageBank").values("showcase", "backgrounds", "C_COLOR", null, [ 0, 100 ]);
        var data = [];

        discussions.forEach(function(discussion) {
            var content = contents.create(discussion);
            var datum = {
                "id":"S_BLOG_" + content.data["author"] + "_" + content.data["permlink"],
                "author":content.data["author"],
                "permlink":content.data["permlink"],
                "title":content.data["title"], 
                "image-url":content.get_title_image_url("256x512"),
                "userpic-url":content.get_userpic_url("small"),
                "userpic-large-url":content.get_userpic_url(),
                "author-reputation":content.get_author_reputation().toFixed(0).toString(),
                "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                "votes-count":content.data["net_votes"].toString(),
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

function __get_discussions_by_blog(username, start_author, start_permlink, length, handler) {
    steemjs.get_discussions_by_blog(username, start_author, start_permlink, length + (start_author ? 1 : 0)).then(function(discussions) {
        if (start_author) {
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


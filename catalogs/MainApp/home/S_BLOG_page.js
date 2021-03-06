var steemjs  = require("steemjs");
var contents = require("contents");
var safety   = require("safety");

var __disallowed_tags = safety.get_disallowed_tags();
var __last_discussion = null;

function feed_blog(keyword, location, length, sortkey, sortorder, handler) {
    var start_author   = (location > 0) ? __last_discussion["author"]   : null;
    var start_permlink = (location > 0) ? __last_discussion["permlink"] : null;

    __get_discussions_by_blog($data["username"], start_author, start_permlink, length, [], function(discussions) {
        var backgrounds = controller.catalog("StyleBank").values("showcase", "backgrounds", "C_COLOR", null, [ 0, 100 ]);
        var me = storage.value("ACTIVE_USER") || "";
        var data = [];

        discussions.forEach(function(discussion) {
            var content = contents.create(discussion);
            var reblogged = (content.data["author"] !== $data["username"]) ? true : false;
            var datum = {
                "id":"S_BLOG_" + content.data["author"] + "_" + content.data["permlink"],
                "author":content.data["author"],
                "permlink":content.data["permlink"],
                "title":content.data["title"], 
                "image-url":content.get_title_image_url("256x512") || "",
                "large-image-url":content.get_title_image_url("640x480") || "",
                "userpic-url":content.get_userpic_url("small"),
                "userpic-large-url":content.get_userpic_url(),
                "author-reputation":content.get_author_reputation().toFixed(0).toString(),
                "votes-count":content.get_vote_count().toString(),
                "vote-weight":me ? content.get_vote_weight(me).toString() : "",
                "replies-count":content.data["children"].toString(),
                "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                "payout-done":content.is_payout_done() ? "yes" : "no",
                "payout-declined":content.is_payout_declined() ? "yes" : "no",
                "reblogged":reblogged ? "yes" : "no",
                "editable":content.is_editable(me) ? "yes" : "no",
                "deletable":content.is_deletable(me) ? "yes" : "no",
                "hidable":(content.is_hidable(me) && !content.is_owner(me)) ? "yes" : "no",
                "main-tag":content.data["category"],
                "created-at":content.data["created"]
            };
 
            datum = Object.assign(datum, __template_data_for_content(content));
            datum = Object.assign(datum, __random_background_data(backgrounds));

            if (content.is_allowed(__disallowed_tags) && !content.is_banned()) {
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

function __get_discussions_by_blog(username, start_author, start_permlink, length, discussions, handler) {
    steemjs.get_discussions_by_blog(username, start_author, start_permlink, length + (start_author ? 1 : 0)).then(function(response) {
        if (start_author && response.length > 0) {
            response = response.splice(1);
        }

        response.forEach(function(discussion) {
            if (discussions.length < length) {
                discussions.push(discussion);
            }
        });

        if (discussions.length < length && response.length > 0) {
            start_author   = response[response.length - 1]["author"];
            start_permlink = response[response.length - 1]["permlink"];

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
    var data = {};

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

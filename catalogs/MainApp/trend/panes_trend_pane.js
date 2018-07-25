var steemjs  = require("steemjs");
var contents = require("contents");
var settings = require("settings");

var __impl = {
    "P_TREND.TRENDING":{
        "method":function(t, a, p, l) { 
            return steemjs.get_discussions_by_trending(t, a, p, l);
        },
        "last_discussion":null
    },
    "P_TREND.HOT":{
        "method":function(t, a, p, l) { 
            return steemjs.get_discussions_by_hot(t, a, p, l);
        },
        "last_discussion":null
    },
    "P_TREND.NEW":{
        "method":function(t, a, p, l) { 
            return steemjs.get_discussions_by_created(t, a, p, l);
        },
        "last_discussion":null
    }
}

var __disallowed_tags = (function() {
    var tags = [];

    if (!settings.nsfw_contents_allowed()) {
        var values = controller.catalog().values("showcase", "nsfw.tags", null, null, [ 0, 100 ]);

        values.forEach(function(value) {
            tags.push(value["tag"]);
        });
    }

    return tags;
})();

function feed_trend(keyword, location, length, sortkey, sortorder, handler) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TREND");
    var tag = value["tag"] || "kr";
    var start_author   = (location > 0) ? __impl[$data["id"]]["last_discussion"]["author"]   : null;
    var start_permlink = (location > 0) ? __impl[$data["id"]]["last_discussion"]["permlink"] : null;

    __impl[$data["id"]].method(tag, start_author, start_permlink, length + (start_author ? 1 : 0)).then(function(discussions) {
        var backgrounds = controller.catalog("ImageBank").values("showcase", "backgrounds", "C_COLOR", null, [ 0, 100 ]);
        var data = [];

        if (location > 0) {
            discussions = discussions.splice(1);
        }

        discussions.forEach(function(discussion) {
            var content = contents.create(discussion);
            var datum = {
                "id":"S_TREND_" + content.data["author"] + "_" + content.data["permlink"],
                "author":content.data["author"],
                "permlink":content.data["permlink"],
                "title":content.data["title"], 
                "image-url":content.get_title_image_url("640x480"),
                "userpic-url":content.get_userpic_url("small"),
                "userpic-large-url":content.get_userpic_url(),
                "author-reputation":content.get_author_reputation().toFixed(0).toString(),
                "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                "votes-count":content.data["net_votes"].toString(),
                "replies-count":content.data["children"].toString(),
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
            __impl[$data["id"]]["last_discussion"] = discussions[discussions.length - 1];
        }

        handler(data);
    });
}

function open_discussion(data) {
    var discussion = __discussion_data_for_value(data);

    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION", discussion);
    controller.action("page", { "display-unit":"S_DISCUSSION", "target":"popup" });
}

function __template_data_for_content(content) {
    var video_id = content.get_title_video_id();

    if (video_id) {
        return {
            "template":video_id[0], 
            "template.video-id":video_id[1]
        }
    }
    
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

    [ "author", "permlink", "userpic-url", "main-tag" ].forEach(function(key) {
        data[key] = value[key];
    });

    Object.keys(value).forEach(function(key) {
        if (key.startsWith("template") || key.startsWith("background")) {
            data[key] = value[key];
        }
    });

    return data;
}

var steemjs  = require("steemjs");
var contents = require("contents");
var media    = require("media");

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

function feed_trend(keyword, location, length, sortkey, sortorder, handler) {
    var start_author   = (location > 0) ? __impl[$data["id"]]["last_discussion"]["author"]   : null;
    var start_permlink = (location > 0) ? __impl[$data["id"]]["last_discussion"]["permlink"] : null;

    __impl[$data["id"]].method("kr", start_author, start_permlink, length).then(function(discussions) {
        var backgrounds = controller.catalog().values("showcase", "backgrounds", "C_COLOR", null, [ 0, 100 ]);
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
            datum = Object.assign(datum, __background_data_for_values(backgrounds));

            data.push(datum);
        });

        if (discussions.length > 0) {
            __impl[$data["id"]]["last_discussion"] = discussions[discussions.length - 1];
        }

        handler(data);
    });
}

function open_discussion(data) {
    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION", {
        "author":data["author"],
        "permlink":data["permlink"],
        "userpic-url":data["userpic-url"]
    });
    
    controller.action("page", { "display-unit":"S_DISCUSSION" });
}

function __template_data_for_content(content) {
    for (var i = 0; i < (content.meta["links"] || []).length; ++i) {
        var youtube_video_id = media.get_youtube_video_id(content.meta["links"][i]);

        if (youtube_video_id && content.meta["links"].length < 4) {
            return {
                "template":"youtube",
                "video-id":youtube_video_id
            }
        }
    }

    if (!content.meta["image"]) {
        return {
            "template":"text"
        }
    }

    return {};
}

function __background_data_for_values(values) {
    var value = values[Math.floor(Math.random()*values.length)];
    var data = {};

    Object.keys(value).forEach(function(key) {
        data["background." + key] = value[key];
    });

    return data;
}

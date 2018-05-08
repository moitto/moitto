var steemjs  = require("steemjs");
var contents = require("contents");

var __impl = {
    "P_TREND.TRENDING":{
        "method":function(t, l, a, p, h) { 
            steemjs.get_discussions_by_trending(t, l, a, p, h);
        },
        "last_discussion":null
    },
    "P_TREND.HOT":{
        "method":function(t, l, a, p, h) { 
            steemjs.get_discussions_by_hot(t, l, a, p, h);
        },
        "last_discussion":null
    },
    "P_TREND.NEW":{
        "method":function(t, l, a, p, h) { 
            steemjs.get_discussions_by_created(t, l, a, p, h);
        },
        "last_discussion":null
    }
}

function feed_trend(keyword, location, length, sortkey, sortorder, handler) {
    var start_author   = (location > 0) ? __impl[$data["id"]]["last_discussion"]["author"]   : null;
    var start_permlink = (location > 0) ? __impl[$data["id"]]["last_discussion"]["permlink"] : null;

    __impl[$data["id"]].method("kr", length, start_author, start_permlink, function(discussions) {
        var data = [];

        if (location > 0) {
            discussions = discussions.splice(1);
        }

        discussions.forEach(function(discussion) {
            var content = contents.create(discussion);
                
            data.push({
                "id":"S_TREND_" + content.data["author"] + "_" + content.data["permlink"],
                "author":content.data["author"],
                "permlink":content.data["permlink"],
                "title":content.data["title"], 
                "image-url":content.get_title_image_url("320x240"),
                "userpic-url":content.get_userpic_url("small"),
                "userpic-large-url":content.get_userpic_url(),
                "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                "votes-count":content.data["net_votes"].toString(),
                "main-tag":content.data["category"],
                "created-at":content.data["created"]
            });
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

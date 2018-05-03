var steemjs = require("steemjs");
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
            var image_url         = __get_image_url_in_discussion(discussion);
            var userpic_url       = __get_userpic_url_in_discussion(discussion);
            var userpic_large_url = __get_userpic_large_url_in_discussion(discussion);;
            var payout_value      = __get_payout_value_in_discussion(discussion).toFixed(2);

            data.push({
                "id":"S_TREND_" + discussion["author"] + "_" + discussion["permlink"],
                "author":discussion["author"],
                "permlink":discussion["permlink"],
                "title":discussion["title"], 
                "image-url":image_url,
                "userpic-url":userpic_url,
                "userpic-large-url":userpic_large_url,
                "payout-value":"$" + payout_value.toString(),
                "votes-count":discussion["net_votes"].toString(),
                "main-tag":discussion["category"],
                "created-at":discussion["created"]
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
    
    controller.action("page", { "display-unit":"S_DISCUSSION", "subview":"V_HOME" });
}

function __get_image_url_in_discussion(discussion) {
    var images = JSON.parse(discussion["json_metadata"])["image"];

    if (images && images.length > 0) {
          return "https://steemitimages.com/640x480/" + images[0];
    }

    return "";
}

function __get_userpic_url_in_discussion(discussion) {
    return "https://steemitimages.com/u/" + discussion["author"] + "/avatar/small";
}

function __get_userpic_large_url_in_discussion(discussion) {
    return "https://steemitimages.com/u/" + discussion["author"] + "/avatar";
}

function __get_payout_value_in_discussion(discussion) {
    var total_payout_value = parseFloat(discussion["total_payout_value"].split(" ")[0]);
    
    if (total_payout_value > 0) {
        return total_payout_value;
    }
    
    return parseFloat(discussion["pending_payout_value"].split(" ")[0]);
}

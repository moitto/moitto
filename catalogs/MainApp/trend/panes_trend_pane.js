var steemjs = require("steemjs");

function feed_trend(keyword, location, length, sortkey, sortorder, handler) {
    this.__get_discussions("kr", 30, null, null, function(discussions) {
       var data = [];

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

        handler(data);
    });
}

function open_discussion(data) {
    document.value("DISCUSSION", {
        "author":data["author"],
        "permlink":data["permlink"]
    });
    
    controller.action("page", { "display-unit":"S_DISCUSSION", "subview":"V_HOME" });
}

function __get_discussions(tag, limit, start_author, start_permlink, handler) {
    if ($data["id"] === "P_TREND.TRENDING") {
        steemjs.get_discussions_by_trending(tag, limit, start_author, start_permlink, function(discussions) {
            handler(discussions);
        });

        return;
    }

    if ($data["id"] === "P_TREND.HOT") {
        steemjs.get_discussions_by_hot(tag, limit, start_author, start_permlink, function(discussions) {
            handler(discussions);
        });

        return;
    }

    if ($data["id"] === "P_TREND.NEW") {
        steemjs.get_discussions_by_created(tag, limit, start_author, start_permlink, function(discussions) {
            handler(discussions);
        });

        return;
    }
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
    var total_payout_value = parseFloat(discussion["total_payout_value"].replace("SBD", "").trim());
    
    if (total_payout_value > 0) {
        return total_payout_value;
    }
    
    return parseFloat(discussion["pending_payout_value"].replace("SBD", "").trim());
}


var steemjs = require("steemjs");

function feed_feeds(keyword, location, length, sortkey, sortorder, handler) {
    steemjs.get_discussions_by_trending("kr", 30, null, null, function(discussions) {
       var data = [];

        discussions.forEach(function(discussion) {
            var userpic_url       = __get_userpic_url_in_discussion(discussion);
            var userpic_large_url = __get_userpic_large_url_in_discussion(discussion);;
            var payout_value      = __get_payout_value_in_discussion(discussion).toFixed(2);

            data.push({
                "id":"S_FEEDS_" + discussion["author"] + "_" + discussion["permlink"],
                "author":discussion["author"],
                "permlink":discussion["permlink"],
                "title":discussion["title"], 
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


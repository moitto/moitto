var steemjs = require("steemjs");
var replies = require("replies");
var themes  = require("themes");

function feed_replies(keyword, location, length, sortkey, sortorder, handler) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_REPLIES");

    if (location == 0) {
        steemjs.get_content_replies(value["author"], value["permlink"]).then(function(response) {
            var theme = themes.create("default");
            var data = [];

            response.reverse().forEach(function(entry) {
                var reply = replies.create(entry);

                data.push({
                    "id":"S_REPLIES_" + value["author"] + "_" + value["permlink"] + "_" + reply.data["author"],
                    "author":reply.data["author"], 
                    "permlink":reply.data["permlink"], 
                    "userpic-url":reply.get_userpic_url("small"),
                    "body":theme.build_body(reply.data["body"], "markdown"),
                    "payout-value":"$" + reply.get_payout_value().toFixed(2).toString(),
                    "replies-count":reply.data["children"].toString(),
                    "created-at":reply.data["created"],
                });
            });

            handler(data);
        });                
    } else {
        handler();
    }
}

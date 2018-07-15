var steemjs = require("steemjs");
var replies = require("replies");
var themes  = require("themes");

function feed_replies(keyword, location, length, sortkey, sortorder, handler) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_REPLIES");
    var path = "/" + value["tag"] + "/@" + value["author"] + "/" + value["permlink"];
    var me = storage.value("ACTIVE_USER");

    if (location == 0) {
        steemjs.get_state(path).then(function(response) {
            var theme = themes.create("default");
            var data = [];

            Object.keys(response["content"]).forEach(function(path) {
                if (response["content"][path]["parent_permlink"] === value["permlink"]) {
                    var reply = replies.create(response["content"][path]);
                    var datum = {
                        "id":"S_REPLIES_" + value["author"] + "_" + value["permlink"] + "_" + reply.data["author"],
                        "author":reply.data["author"], 
                        "permlink":reply.data["permlink"], 
                        "userpic-url":reply.get_userpic_url("small"),
                        "body":theme.build_body(reply.data["body"], "markdown", []),
                        "payout-value":"$" + reply.get_payout_value().toFixed(2).toString(),
                        "replies-count":reply.data["children"].toString(),
                        "created-at":reply.data["created"],
                        "voted":reply.is_voted(me) ? "yes" : "no"
                    }

                    if (reply.is_allowed()) {
                        data.push(datum);
                    }
                }
            });

            handler(data);
        });                
    } else {
        handler();
    }
}

function comment() {
    controller.catalog().submit("showcase", "auxiliary", "S_COMMENT", {
        "author":"",
        "permlink":""
    });

    controller.action("popup", { "display-unit":"S_COMMENT" })
}

function show_replies(data) {
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES.CONTENT", data);
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES", {
        "author":data["author"],
        "permlink":data["permlink"],
        "content-type":"reply",
        "has-own-navibar":"yes"
    });

    controller.action("page", { "display-unit":"S_REPLIES", "target":"popup" })
}

var global  = require("global");
var replies = require("replies");
var themes  = require("themes");

function on_loaded() {
    if ($data["content-type"] === "reply") {
        var value = controller.catalog().value("showcase", "auxiliary", "S_REPLIES");
        var me = storage.value("ACTIVE_USER");
    
        global.get_content(value["author"], value["permlink"]).then(function(content) {
            console.log(content.data["body"]);
            var impl = themes.create("default");

            var data = {
                "author":content.data["author"],
                "permlink":content.data["permlink"],
                "userpic-url":content.get_userpic_url("small"),
                "title":content.data["title"],
                "body":impl.build_body(content.data["body"], content.meta["format"]),
                "votes-count":content.data["net_votes"].toString(),
                "replies-count":content.data["children"].toString(),
                "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                "is-payout":content.is_payout() ? "yes" : "no",
                "created-at":content.data["created"]
            };

            Object.keys(impl.auxiliary).forEach(function(key) {
                data[key] = impl.auxiliary[key];
            });

            if (content.is_voted(me)) {
                data["voted"] = "yes"; 
            }

            controller.catalog().submit("showcase", "auxiliary", "S_REPLIES.CONTENT", data);
            view.object("showcase.replies").action("reload-header");
        });
    }
}

function feed_replies(keyword, location, length, sortkey, sortorder, handler) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_REPLIES");

    if (location == 0) {
        global.steemjs.get_content_replies(value["author"], value["permlink"]).then(function(response) {
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

function comment() {
    controller.catalog().submit("showcase", "auxiliary", "S_COMMENT", {
        "author":"",
        "permlink":""
    });

    controller.action("popup", { "display-unit":"S_COMMENT" })
}

function show_replies(data) {
    controller.catalog().remove("showcase", "auxiliary", "S_REPLIES.CONTENT");
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES", {
        "author":data["author"],
        "permlink":data["permlink"],
        "content-type":"reply"
    });

    controller.action("page", { "display-unit":"S_REPLIES" })
}

var steemjs = require("steemjs");
var replies = require("replies");
var themes  = require("themes");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_REPLIES");
    var path = "/" + value["tag"] + "/@" + value["author"] + "/" + value["permlink"];
    var me = storage.value("ACTIVE_USER") || "";

    steemjs.get_state(path).then(function(response) {
        var theme = themes.create("default");
        var replies_text = "";
        var replies_data = [];

        Object.keys(response["content"]).forEach(function(path) {
            var content = response["content"][path];

            //console.log("!!!!!!!!!!!");
            //console.log(JSON.stringify(content));

            if (content["parent_permlink"] === value["permlink"] && content["parent_permlink"] != content["permlink"]) {
                var reply = replies.create(content);
                var datum = {
                    "id":"S_REPLIES_" + reply.data["permlink"],
                    "author":reply.data["author"], 
                    "permlink":reply.data["permlink"], 
                    "parent-author":reply.data["parent_author"],
                    "parent-permlink":reply.data["parent_permlink"],
                    "userpic-url":reply.get_userpic_url("small"),
                    "body":theme.build_body(reply.data["body"], "markdown", []),
                    "body-text":reply.data["body"], 
                    "payout-value":"$" + reply.get_payout_value().toFixed(2).toString(),
                    "replies-count":reply.data["children"].toString(),
                    "created-at":reply.data["created"],
                    "vote-weight":reply.get_vote_weight(me).toString(),
                    "editable":reply.is_editable(me) ? "yes" : "no",
                    "deletable":reply.is_deletable(me) ? "yes" : "no",
                }

                if (!reply.is_banned() && !reply.is_down_voted(value["author"]) ) {
                    replies_data.push(datum);
                }
            }
        });

        replies_data.sort(function(datum1, datum2) {
            return datum2["created-at"].localeCompare(datum1["created-at"]);
        });

        replies_data.forEach(function(datum) {
            replies_text += read("catalog@resource", "showcase_replies.tmpl_cell.sbml", datum) + "\n";
            replies_text += "\n";
        });

        controller.catalog().update("showcase", "replies." + value["author"] + "." + value["permlink"]);
        controller.catalog().update("showcase", "replies." + value["author"] + "." + value["permlink"], replies_data);

        var data = {
            "replies":replies_text,
            "has-own-sbml":"no"
        };

        view.data("display-unit", data);
        view.data("environment", { "alternate-name":"replies" });
        view.action("reload"); 
    });
}

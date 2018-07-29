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
                    "vote-weight":reply.get_vote_weight(me).toString()
                }

                if (!reply.is_banned()) {
                    replies_text += read("catalog@resource", "showcase_replies.tmpl_cell.sbml", datum) + "\n";
                    replies_text += "\n";

                    replies_data.push(datum);
                }
            }
        });

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

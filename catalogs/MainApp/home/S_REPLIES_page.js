var steemjs = require("steemjs");
var replies = require("replies");
var themes  = require("themes");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_REPLIES");
    var me = storage.value("ACTIVE_USER") || "";

    __get_replies(value["tag"], value["author"], value["permlink"], function(response) {
        var theme = themes.create("default");
        var replies_data = [];

        response.forEach(function(content) {
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
                "payout-done":reply.is_payout_done() ? "yes" : "no",
                "replies-count":reply.data["children"].toString(),
                "created-at":reply.data["created"],
                "vote-weight":reply.get_vote_weight(me).toString(),
                "editable":reply.is_editable(me) ? "yes" : "no",
                "deletable":reply.is_deletable(me) ? "yes" : "no",
                "hidable":(reply.is_hidable(me) && !reply.is_owner(me)) ? "yes" : "no"
            }

            if (!reply.is_banned() && !reply.is_down_voted(value["author"]) ) {
                replies_data.push(datum);
            }
        });

        controller.catalog().update("showcase", "replies." + value["author"] + "." + value["permlink"]);
        controller.catalog().update("showcase", "replies." + value["author"] + "." + value["permlink"], replies_data);

        replies_data.sort(function(datum1, datum2) {
            return datum2["created-at"].localeCompare(datum1["created-at"]);
        });

        __get_replies_text(replies_data, function(replies_text) {
            var data = {
                "replies":replies_text,
                "replies-count":replies_data.length.toString(),
                "has-own-sbml":"no"
            };

            view.data("display-unit", data);
            view.data("environment", { "alternate-name":"replies" });
            view.action("reload");
        });
    });
}

function __get_replies(tag, author, permlink, handler) {
    var path = "/" + tag + "/@" + author + "/" + permlink;
    var replies = [];

    steemjs.get_state(path).then(function(response) {
        if (response) {
            Object.keys(response["content"]).forEach(function(path) {
                var content = response["content"][path];

                if (content["parent_permlink"] === permlink && content["parent_permlink"] != content["permlink"]) {
                    replies.push(content);
                }
            });

            handler(replies);            
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
}

function __get_replies_text(data, handler) {
    var replies_text = "";
    var promises = [];

    data.forEach(function(datum) {
        promises.push(new Promise(function(resolve, reject) {
            read("catalog@resource", "showcase_replies.tmpl_cell.sbml", datum).then(function(text) {
                replies_text += text + "\n";
                replies_text += "\n";

                resolve();
            });
        }));
    });

    Promise.all(promises).then(function() {
        handler(replies_text);
    });
}


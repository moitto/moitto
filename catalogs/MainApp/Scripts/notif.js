Notif = (function() {
    return {};
})();

Notif.update = function(username, history) {
    var catalog = controller.catalog();
    var has_new_notif = false;

    history.reverse().forEach(function(data) {
        if (Notif.__is_notify_op_for_account(data["op"], username)) {
            if (Notif.__update_notif(catalog, username, data["op"], data["timestamp"])) {
                has_new_notif = true;
            }
        }
    });

    return has_new_notif;
}

Notif.values = function(username, location, length, sortkey, sortorder) {
    var catalog = controller.catalog();

    return catalog.values("showcase", "notif@" + username, null, null, [location, length], [sortkey, sortorder]);
}

Notif.value = function(username, identifier) {
    var catalog = controller.catalog();

    return catalog.value("showcase", "notif@" + username, identifier);
}

Notif.check = function(username, identifier) {
    var catalog = controller.catalog();
    var value = catalog.value("showcase", "notif@" + username, identifier);

    value["checked"] = "yes";

    catalog.submit("showcase", "notif@" + username, identifier, value);
}

Notif.__update_notif = function(catalog, username, op, timestamp) {
    if (op[0] === "comment") {
        var category = "comment-" + op[1]["parent_permlink"];
        var values = catalog.values("showcase", "notif@" + username, category, null, [0, 1]);
        var actors = [ op[1]["author"] ];

        if (values.length > 0) {
            var last_actors = values[0]["actors"].split(",");

            if (last_actors.includes(op[1]["author"])) {
                return false;
            }
            
            actors = actors.concat(last_actors);
 
            catalog.categorize("showcase", "notif@" + username, values[0]["id"], null, [ category ]);
            catalog.remove("showcase", "notif@" + username, values[0]["id"]);
        }

        var value = {};

        value["id"]       = timestamp + "-comment-" + op[1]["parent_author"] + "-" + op[1]["parent_permlink"];
        value["op"]       = "comment";
        value["date"]     = timestamp;
        value["author"]   = op[1]["parent_author"];
        value["permlink"] = op[1]["parent_permlink"];
        value["actors"]   = actors.join(",");

        catalog.submit("showcase", "notif@" + username, value["id"], value);
        catalog.categorize("showcase", "notif@" + username, value["id"], [ category ], null);

        return true;
    }

    if (op[0] === "vote") {
        var prefix = op[1]["weight"] < 0 ? "down" : "up";
        var category = prefix + "vote-" + op[1]["permlink"];
        var values = catalog.values("showcase", "notif@" + username, category, null, [0, 1]);
        var actors = [ op[1]["voter"] ];

        if (values.length > 0) {
            var last_actors = values[0]["actors"].split(",");

            if (last_actors.includes(op[1]["voter"])) {
                return false;
            }
            
            actors = actors.concat(last_actors);

            catalog.categorize("showcase", "notif@" + username, values[0]["id"], null, [ category ]);
            catalog.remove("showcase", "notif@" + username, values[0]["id"]);
        }

        var value = {};

        value["id"]       = timestamp + "-" + prefix + "vote-" + op[1]["author"] + "-" + op[1]["permlink"];
        value["op"]       = prefix + "vote";
        value["date"]     = timestamp;
        value["author"]   = op[1]["author"];
        value["permlink"] = op[1]["permlink"];
        value["actors"]   = actors.join(",");

        catalog.submit("showcase", "notif@" + username, value["id"], value);
        catalog.categorize("showcase", "notif@" + username, value["id"], [ category ], null);

        return true;
    }

    if (op[0] === "transfer") {
        var value = {};

        value["id"]     = timestamp + "-" + "transfer-" + op[1]["from"];
        value["op"]     = "transfer";
        value["date"]   = timestamp;
        value["from"]   = op[1]["from"];
        value["amount"] = op[1]["amount"];
        value["memo"]   = op[1]["memo"];

        catalog.submit("showcase", "notif@" + username, value["id"], value);

        return true;
    }
}

Notif.__is_notify_op_for_account = function(op, account) {
    if (op[0] === "comment") {
        if (op[1]["author"] !== account) {
            return true;
        }

        return false;
    }

    if (op[0] === "vote") {
        if (op[1]["author"] === account && op[1]["voter"] !== account) {
            return true;
        }

        return false;
    }

    if (op[0] === "transfer") {
        if (op[1]["to"] === account) {
            return true;
        }
    
        return false;
    }

    return false;
}

__MODULE__ = Notif;

Notif = (function() {
    return {
        __updating : false
    };
})();

Notif.steemjs = require("steemjs");

Notif.update = function() {
    return new Promise(function(resolve, reject) {
        var username = storage.value("ACTIVE_USER");
        var earliest_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
        var last_updated_date = /*storage.value("NOTIF_UPDATED_DATE") || */earliest_date;

        Notif.__get_account_history_for_notif(username, last_updated_date).then(function(history) {
            history.reverse().forEach(function(data) {
                Notif.__update_notif(controller.catalog(), username, data["op"], data["timestamp"]);
            });

            resolve(history);

            Notif.__updating = false;
        }, function(reason) {
            reject(reason);

            Notif.__updating = false;
        });

        Notif.__updating = true;
    });
}

Notif.is_updating = function() {
    return Notif.__updating;
}

Notif.__get_account_history_for_notif = function(account, last_updated_date) {
    return new Promise(function(resolve, reject) {
        var history = [];

        Notif.steemjs.get_account_history(account, Number.MAX_SAFE_INTEGER, 3000).then(function(response) {
            response = response.reverse();

            for (var i = 0; i < response.length; ++i) {
                var timestamp = response[i][1]["timestamp"];
                var op = response[i][1]["op"];
 
                if (last_updated_date > new Date(Date.parse(timestamp))) {
                    break;
                }

                if (Notif.__is_notify_op_for_account(op, account)) {
                    history.push(response[i][1]);
                }
            }

            resolve(history);
        }, function(reason) {
            reject(reason);
        });
    });
}

Notif.__update_notif = function(catalog, username, op, timestamp) {
    if (op[0] === "comment") {
        var category = "comment-" + op[1]["parent_permlink"];
        var values = catalog.values("showcase", "notif@" + username, category, null, [0, 1]);
        var actors = [ op[1]["author"] ];

        if (values.length > 0) {
            var last_actors = values[0]["actors"].split(",");

            if (last_actors.includes(op[1]["author"])) {
                return;
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

        return;
    }

    if (op[0] === "vote") {
        var prefix = op[1]["weight"] < 0 ? "down" : "up";
        var category = prefix + "vote-" + op[1]["permlink"];
        var values = catalog.values("showcase", "notif@" + username, category, null, [0, 1]);
        var actors = [ op[1]["voter"] ];

        if (values.length > 0) {
            var last_actors = values[0]["actors"].split(",");

            if (last_actors.includes(op[1]["voter"])) {
                return;
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

        return;
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

        return;
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

var users = require("users");

function feed_notif(keyword, location, length, sortkey, sortorder, handler) {
    var values = controller.catalog().values("showcase", "notif", null, null, [location, length], [sortkey, sortorder]);
    var data = [];

    values.forEach(function(value) {
        __extend_value_for_op(value["op"], value);

        value["template"] = value["op"];
 
        data.push(value);
    });

    handler(data);
}

function open_notif(data) {
    data["checked"] = "yes";

    controller.catalog().submit("showcase", "notif", data["id"], data);
    ___reload_notif_cell(data);
}

function __extend_value_for_op(op, value) {
    if (op === "comment") {
        var authors = value["authors"].split(",");

        if (authors.length > 0) {
            var user = users.create(authors[0]);

            value["author-1"] = user.name;
            value["userpic-url-1"] = user.get_userpic_url("small");
            value["authors-count-n"] = (authors.length - 1).toString();
        }

        if (authors.length > 1) {
            var user = users.create(authors[1]);

            value["author-2"] = user.name;
            value["userpic-url-2"] = user.get_userpic_url("small");
            value["authors-count-n"] = (authors.length - 2).toString();
        }

        value["source"] = value["permlink"].startsWith("re-") ? "comment" : "discussion";

        return;
    }

    if (op === "upvote" || op === "downvote") {
        var voters = value["voters"].split(",");

        if (voters.length > 0) {
            var user = users.create(voters[0]);

            value["voter-1"] = user.name;
            value["userpic-url-1"] = user.get_userpic_url("small");
            value["voters-count-n"] = (voters.length - 1).toString();
        }

        if (voters.length > 1) {
            var user = users.create(voters[1]);

            value["voter-2"] = user.name;
            value["userpic-url-2"] = user.get_userpic_url("small");
            value["voters-count-n"] = (voters.length - 2).toString();
        }

        value["source"] = value["permlink"].startsWith("re-") ? "comment" : "discussion";

        return;
    }

    if (op === "follows") {
     
        return;   
    }

    if (op === "transfer") {

        return;
    }
}


function ___reload_notif_cell(data) {
    var cell = view.object("showcase.notif").view("cell", data["id"]);

    cell.data("display-unit", data);
    cell.action("reload")
}

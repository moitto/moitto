var account = require("account");
var users   = require("users");

function on_loaded() {
    if (!account.is_logged_in()) {
        __hide_loading_section();
        __show_login_section();
        
        return;
    }

    __hide_loading_section();
    __show_notif_showcase();
}

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
    var me = storage.value("ACTIVE_USER");
    var catalog = controller.catalog();
    var value = catalog.value("showcase", "notif", data["id"]);

    value["checked"] = "yes";
    data["checked"] = "yes";

    catalog.submit("showcase", "notif", data["id"], value);
    ___reload_notif_cell(data);

    if (value["op"] === "upvote" || value["op"] === "downvote") {
        if (data["source"] === "discussion") {
            __open_discussion(value["author"], value["permlink"]);

            return;
        }

        if (data["source"] === "comment") {
            __show_replies(value["author"], value["permlink"]);

            return;
        }

        return;
    }

    if (value["op"] === "comment") {
        if (data["source"] === "comment") {
            __show_replies(value["author"], value["permlink"]);

            return;
        }

        return;
    }
}

function __extend_value_for_op(op, value) {
    if ([ "upvote", "downvote", "comment" ].includes(op)) {
        var actors = value["actors"].split(",");

        if (actors.length > 0) {
            var user = users.create(actors[0]);

            value["actor-1"] = user.name;
            value["userpic-url-1"] = user.get_userpic_url("small");
            value["actors-count-n"] = (actors.length - 1).toString();
        }

        if (actors.length > 1) {
            var user = users.create(actors[1]);

            value["actor-2"] = user.name;
            value["userpic-url-2"] = user.get_userpic_url("small");
            value["actors-count-n"] = (actors.length - 2).toString();
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

function __open_discussion(author, permlink) {
    var user = users.create(author);

    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION", {
        "author":author,
        "permlink":permlink,
        "userpic-url":user.get_userpic_url("small")
    });

    controller.action("page", { "display-unit":"S_DISCUSSION" });
}

function __show_replies(author, permlink) {
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES", {
        "author":author,
        "permlink":permlink
    });

    controller.action("page", { "display-unit":"S_REPLIES" })
}

function ___reload_notif_cell(data) {
    var cell = view.object("showcase.notif").view("cell", data["id"]);

    cell.data("display-unit", data);
    cell.action("reload")
}

function __show_notif_showcase() {
    var showcase = view.object("showcase.notif");

    showcase.action("show");
}

function __show_login_section() {
    var section = view.object("section.login");

    section.action("show");
}

function __hide_loading_section() {
    var section = view.object("section.loading");

    section.action("hide");
}

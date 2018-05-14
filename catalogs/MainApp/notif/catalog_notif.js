function feed_notif(keyword, location, length, sortkey, sortorder, handler) {
    var values = controller.catalog().values("showcase", "notif", null, null, [location, length], [sortkey, sortorder]);
    var data = [];

    values.forEach(function(value) {
        console.log(value["op"]);
        __extend_value_for_op(value["op"], value);

        value["template"] = value["op"];
 
        data.push(value);
    });

    handler(data);
}

function __extend_value_for_op(op, value) {
    if (op === "comment") {
        var authors = value["authors"].split(",");

        if (authors.length > 0) {
            value["author-1"] = authors[0];
            value["authors-count-n"] = (authors.length - 1).toString();
        }

        if (authors.length > 1) {
            value["author-2"] = authors[1];
            value["authors-count-n"] = (authors.length - 2).toString();
        }

        value["source"] = value["permlink"].startsWith("re-") ? "comment" : "discussion";

        return;
    }

    if (op === "upvote" || op === "downvote") {
        var voters = value["voters"].split(",");

        if (voters.length > 0) {
            value["voter-1"] = voters[0];
            value["voters-count-n"] = (voters.length - 1).toString();
        }

        if (voters.length > 1) {
            value["voter-2"] = voters[1];
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

function upvote(form) {
    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.UPVOTE", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });

    controller.action("popup", { "display-unit":"S_DISCUSSION.UPVOTE" });
}

function downvote(form) {
    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.DOWNVOTE", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });

    controller.action("popup", { "display-unit":"S_DISCUSSION.DOWNVOTE" });
}

function unvote(form) {
    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.UNVOTE", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });

    controller.action("popup", { "display-unit":"S_DISCUSSION.UNVOTE" });
}

function reblog(form) {
    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.REBLOG", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });

    controller.action("popup", { "display-unit":"S_DISCUSSION.REBLOG" });
}

function copy_url(form) {
    var url = "https://steemit.com/@" + $data["author"] + "/" + $data["permlink"];

    controller.action("copy", {
        "target":"clipboard",
        "text":url,
        "close-popup":"yes"
    });
}

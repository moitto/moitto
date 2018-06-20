function upvote(form) {
    controller.action("popup", {
        "display-unit":"S_DISCUSSION.POPUP",
        "alternate-name":"discussion.vote",
        "dir-path":$data["dir-path"]
    });
}

function unvote(form) {
    controller.action("popup", {
        "display-unit":"S_DISCUSSION.POPUP",
        "alternate-name":"discussion.unvote",
        "dir-path":$data["dir-path"]
    });
}

function reblog(form) {
    controller.catalog().submit("showcase", "auxiliary", "S_REBLOG", {
        "status":"progress",
        "author":$data["author"],
        "permlink":$data["permlink"]
    });

    controller.action("popup", { "display-unit":"S_REBLOG" });
}

function copy_url(form) {
    var url = "https://steemit.com/@" + $data["author"] + "/" + $data["permlink"];

    controller.action("copy", {
        "target":"clipboard",
        "text":url,
        "close-popup":"yes"
    });
}

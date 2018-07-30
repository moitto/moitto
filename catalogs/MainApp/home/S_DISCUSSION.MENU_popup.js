function upvote(form) {
    if (storage.value("ACTIVE_USER")) {
        controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.UPVOTE", {
            "author":$data["author"],
            "permlink":$data["permlink"]
        });

        controller.action("popup", { "display-unit":"S_DISCUSSION.UPVOTE" });
    } else {
        controller.action("subview", { 
            "subview":"V_LOGIN", 
            "target":"popup",
            "close-popup":"yes" 
        });
    }
}

function downvote(form) {
    if (storage.value("ACTIVE_USER")) {
        controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.DOWNVOTE", {
            "author":$data["author"],
            "permlink":$data["permlink"]
        });

        controller.action("popup", { "display-unit":"S_DISCUSSION.DOWNVOTE" });
    } else {
        controller.action("subview", { 
            "subview":"V_LOGIN", 
            "target":"popup",
            "close-popup":"yes" 
        });
    }
}

function unvote(form) {
    if (storage.value("ACTIVE_USER")) {
        controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.UNVOTE", {
            "author":$data["author"],
            "permlink":$data["permlink"]
        });

        controller.action("popup", { "display-unit":"S_DISCUSSION.UNVOTE" });
    } else {
        controller.action("subview", { 
            "subview":"V_LOGIN", 
            "target":"popup",
            "close-popup":"yes" 
        });
    }
}

function reblog(form) {
    if (storage.value("ACTIVE_USER")) {
        controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.REBLOG", {
            "author":$data["author"],
            "permlink":$data["permlink"]
        });

        controller.action("popup", { "display-unit":"S_DISCUSSION.REBLOG" });
    } else {
        controller.action("subview", { 
            "subview":"V_LOGIN", 
            "target":"popup",
            "close-popup":"yes" 
        });
    }
}

function report(form) {
    if (storage.value("ACTIVE_USER")) {
        controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.REPORT", {
            "author":$data["author"],
            "permlink":$data["permlink"],
            "status":"report"
        });

        controller.action("popup", { "display-unit":"S_DISCUSSION.REPORT" });
    } else {
        controller.action("subview", { 
            "subview":"V_LOGIN", 
            "target":"popup",
            "close-popup":"yes" 
        });
    }
}

function copy_url(form) {
    var url = "https://steemit.com/@" + $data["author"] + "/" + $data["permlink"];

    controller.action("copy", {
        "target":"clipboard",
        "text":url,
        "close-popup":"yes"
    });
}

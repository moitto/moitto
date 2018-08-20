function vote() {
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

function unvote() {
    document.value("VOTE", {
        author:$data["author"],
        permlink:$data["permlink"],
        weight:0
    });

    controller.action("script", { 
        "script":"vote",
        "subview":"__MAIN__",
        "close-popup":"yes"
    });
}

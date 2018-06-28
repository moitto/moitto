function unvote() {
    document.value("VOTE", {
        author:$data["author"],
        permlink:$data["permlink"],
        weight:0,
        subview:$data["SUBVIEW"]
    });

    controller.action("script", { 
        "script":"vote",
        "subview":"__MAIN__",
        "close-popup":"yes"
    });
}

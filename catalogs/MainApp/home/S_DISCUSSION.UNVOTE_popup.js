function unvote() {
    controller.action("script", { 
        "script":"actions.vote",
        "subview":"__MAIN__",
        "author":$data["author"],
        "permlink":$data["permlink"],
        "weight":"0",
        "close-popup":"yes"
    });
}

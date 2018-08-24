function unvote() {
    controller.action("script", { 
        "script":"actions.unvote",
        "subview":"__MAIN__",
        "author":$data["author"],
        "permlink":$data["permlink"],
        "close-popup":"yes"
    });
}

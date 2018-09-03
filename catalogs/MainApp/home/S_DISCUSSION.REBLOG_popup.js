function reblog() {
    controller.action("script", { 
        "script":"actions.reblog",
        "subview":"__MAIN__",
        "routes-to-topmost":"no",
        "author":$data["author"],
        "permlink":$data["permlink"],
        "close-popup":"yes"
    });
}

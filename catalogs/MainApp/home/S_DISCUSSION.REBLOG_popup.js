function reblog() {
    controller.action("script", { 
        "script":"api.reblog",
        "subview":"__MAIN__",
        "author":$data["author"],
        "permlink":$data["permlink"],
        "close-popup":"yes"
    });
}

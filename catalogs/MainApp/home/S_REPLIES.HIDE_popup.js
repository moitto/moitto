function hide_comment() {
    controller.action("script", { 
        "script":"actions.hide_comment",
        "subview":"__MAIN__",
        "routes-to-topmost":"no",
        "parent-author":$data["parent-author"],
        "parent-permlink":$data["parent-permlink"],
        "author":$data["author"],
        "permlink":$data["permlink"],
        "close-popup":"yes"
    });
}

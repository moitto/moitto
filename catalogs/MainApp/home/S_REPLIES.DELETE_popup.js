function delete_comment() {
    controller.action("script", { 
        "script":"actions.delete_comment",
        "subview":"__MAIN__",
        "parent-author":$data["parent-author"],
        "parent-permlink":$data["parent-permlink"],
        "permlink":$data["permlink"],
        "close-popup":"yes"
    });
}

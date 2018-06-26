function reblog() {
    document.value("REBLOG", {
        author:$data["author"],
        permlink:$data["permlink"]
    });

    controller.action("script", { 
        "script":"reblog",
        "subview":"__MAIN__",
        "close-popup":"yes"
    });
}

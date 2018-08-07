function on_change_data(identifier, data) {
    view.action("reload");
}

function comment() {
    if (storage.value("ACTIVE_USER")) {
        controller.catalog().submit("showcase", "auxiliary", "S_COMMENT", {
            "parent-author":$data["author"],
            "parent-permlink":$data["permlink"]
        });

        controller.action("popup", { "display-unit":"S_COMMENT" });
    } else {
        controller.action("subview", { 
            "subview":"V_LOGIN", 
            "target":"popup",
            "close-popup":"yes" 
        });
    }
}

function edit_comment() {
    controller.catalog().submit("showcase", "auxiliary", "S_COMMENT", {
        "parent-author":$data["parent-author"],
        "parent-permlink":$data["parent-permlink"],
        "permlink":$data["permlink"],
        "text":$data["body-text"]
    });

    controller.action("popup", { "display-unit":"S_COMMENT" });
}

function delete_comment() {
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES.DELETE", {
        "parent-author":$data["parent-author"],
        "parent-permlink":$data["parent-permlink"],
        "permlink":$data["permlink"]
    });

    controller.action("popup", { "display-unit":"S_REPLIES.DELETE" });
}

function show_votes() {
    controller.catalog().submit("showcase", "auxiliary", "S_VOTES", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });

    controller.action("page", { "display-unit":"S_VOTES", "target":"popup" })
}

function show_replies() {
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });

    controller.action("page", { "display-unit":"S_REPLIES", "target":"popup" })
}

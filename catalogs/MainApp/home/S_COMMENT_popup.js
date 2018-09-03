function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_COMMENT");
    var identifier = "S_COMMENTS_" + value["parent-author"] + "_" + value["parent-permlink"];
    var temporary = controller.catalog().value("showcase", "comments", identifier);
    var editor = view.object("editor");

    if (temporary) {
        editor.property({ "text":temporary["text"] });
    } else {
        editor.property({ "text":value["text"] });
    }
}

function close() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_COMMENT");
    var editor = view.object("editor");
    var text = editor.value();

    if (text.length > 0 && text !== value["text"]) {
        controller.action("prompt", {
            "title":"알림",
            "message":"이 댓글을 임시 저장하시겠어요?",
            "button-1":"임시저장;script;script=save",
            "button-2":"댓글 삭제;script;script=discard",
            "cancel-label":"돌아가기"
        });
    } else {
        controller.action("popup-close");        
    }
}

function submit() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_COMMENT");
    var editor = view.object("editor");

    controller.action("script", { 
        "script":"actions.comment",
        "subview":"__MAIN__",
        "routes-to-topmost":"no",
        "parent-author":value["parent-author"],
        "parent-permlink":value["parent-permlink"],
        "permlink":value["permlink"] || "",
        "title":"",
        "body":editor.value(),
        "meta":JSON.stringify({})
    });

    controller.action("popup-close");
}

function save() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_COMMENT");
    var identifier = "S_COMMENTS_" + value["parent-author"] + "_" + value["parent-permlink"];
    var editor = view.object("editor");

    controller.catalog().submit("showcase", "comments", identifier, {
        "text":editor.value()
    });
    controller.action("popup-close");
}

function discard() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_COMMENT");
    var identifier = "S_COMMENTS_" + value["parent-author"] + "_" + value["parent-permlink"];

    controller.catalog().remove("showcase", "comments", identifier);
    controller.action("popup-close");
}

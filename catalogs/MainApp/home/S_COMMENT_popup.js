function on_loaded() {
    var identifier = "S_COMMENTS_" + $data["author"] + "_" + $data["permlink"];
    var value = controller.catalog().value("showcase", "comments", identifier);
    var editor = view.object("editor");

    if (value) {
        editor.property({ "text":value["text"] });
    }
}

function close() {
    var editor = view.object("editor");

    if (editor.value().length > 0) {
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
    var editor = view.object("editor");

    controller.action("script", { 
        "script":"api.comment",
        "subview":"__MAIN__",
        "parent_author":$data["author"],
        "parent_permlink":$data["permlink"],
        "title":"",
        "body":editor.value(),
        "meta":JSON.stringify({})
    });

    controller.action("popup-close");
}

function save() {
    var identifier = "S_COMMENTS_" + $data["author"] + "_" + $data["permlink"];
    var editor = view.object("editor");

    controller.catalog().submit("showcase", "comments", identifier, {
        "text":editor.value()
    });
    controller.action("popup-close");
}

function discard() {
    var identifier = "S_COMMENTS_" + $data["author"] + "_" + $data["permlink"];

    controller.catalog().remove("showcase", "comments", identifier);
    controller.action("popup-close");
}

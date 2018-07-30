function close() {
    var editor = view.object("editor");

    if (editor.value().length > 0) {
        controller.action("prompt", {
            "title":"알림",
            "message":"이 댓글을 임시 저장하시겠어요?",
            "button-1":"임시저장;script;script=save",
            "button-2":"댓글 삭제;popup-close;",
            "cancel-label":"돌아가기"
        });
    } else {
        controller.action("popup-close");        
    }
}

function submit() {
    controller.action("popup-close");
}

function save() {
    controller.action("popup-close");
}

var __signature = "<div class=\"hidden-signature\">Posted using <a href=\"https://steemit.com/@moitto\">Moitto</a></div>";
var __signature_pattern = /\n+<div class=\"hidden-signature\">.*?<\/div>/;

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_COMMENT");
    var identifier = "S_COMMENTS_" + value["parent-author"] + "_" + value["parent-permlink"];
    var temporary = controller.catalog().value("showcase", "comments", identifier);
    var text = temporary ? temporary["text"] : (value["text"] || "").replace(__signature_pattern, "");

    view.object("editor").property({ "text":text });
}

function close() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_COMMENT");
    var editor = view.object("editor");
    var text = editor.value();

    if (text.length > 0 && text !== (value["text"] || "").replace(__signature_pattern, "")) {
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
    var text = view.object("editor").value();

    controller.action("script", { 
        "script":"actions.comment",
        "subview":"__MAIN__",
        "routes-to-topmost":"no",
        "parent-author":value["parent-author"],
        "parent-permlink":value["parent-permlink"],
        "permlink":value["permlink"] || "",
        "title":"",
        "body":text + "\n\n" + __signature,
        "meta":JSON.stringify({})
    });

    controller.action("popup-close");
}

function save() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_COMMENT");
    var identifier = "S_COMMENTS_" + value["parent-author"] + "_" + value["parent-permlink"];
    var text = view.object("editor").value();

    controller.catalog().submit("showcase", "comments", identifier, {
        "text":text
    });
    controller.action("popup-close");
}

function discard() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_COMMENT");
    var identifier = "S_COMMENTS_" + value["parent-author"] + "_" + value["parent-permlink"];

    controller.catalog().remove("showcase", "comments", identifier);
    controller.action("popup-close");
}

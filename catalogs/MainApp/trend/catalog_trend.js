function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TREND");
    var tag = value["tag"] || "kr";

    console.log(value["tag"] || "kr");

    __update_tag_label(tag);
}

function show_tags() {
    controller.action("popup", { "display-unit":"S_TAGS" })
}

function change_tag(data) {
    var tag = data["tag"];

    controller.action("alert", { "message":tag })

    __update_tag_label(tag);
}

function __update_tag_label(tag) {
    var button = view.object("btn.tag");

    button.property({ "label":tag });
}

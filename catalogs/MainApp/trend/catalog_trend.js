function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TREND");
    var tag = value["tag"] || "kr";

    __update_tag_label(tag);
}

function show_tags() {
    controller.action("popup", { "display-unit":"S_TAGS" })
}

function change_tag(data) {
    var tag = data["tag"];

    controller.catalog().submit("showcase", "auxiliary", "S_TREND", {
        "tag":tag
    });

    __reload_trend_panes();
    __update_tag_label(tag);
}

function __update_tag_label(tag) {
    var button = view.object("btn.tag");

    button.property({ "label":"#" + tag });
}

function __reload_trend_panes() {
    var panes = view.object("panes.trend");

    panes.action("reload");
}

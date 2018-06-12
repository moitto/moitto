function on_loaded() {
}

function change_tag(form) {
    var tag = form["tag"].trim();

    __save_tag_to_history(tag);
    __change_tag_of_host(tag);
}

function remove_tag(form) {
    var tag = form["tag"].trim();

    __remove_tag_in_history(tag);
    __remove_history_cell(tag);
}

function select_history(data) {
    var tag = data["tag"].trim();

    __save_tag_to_history(tag);
    __change_tag_of_host(tag);
}

function reset_history() {
    console.log("reset_history!!!!");
    __remove_all_tags_in_history();
    __reload_history_showcase();
}

function __save_tag_to_history(tag) {
    var identifier = "S_TAGS.HISTORY_" + tag;

    controller.catalog().remove("showcase", "tags.history", identifier);
    controller.catalog().submit("showcase", "tags.history", identifier, {
        "id":identifier,
        "tag":tag
    });
}

function __remove_tag_in_history(tag) {
    var identifier = "S_TAGS.HISTORY_" + tag;

    controller.catalog().remove("showcase", "tags.history", identifier);
}

function __remove_all_tags_in_history() {
    controller.catalog().remove("showcase", "tags.history");
}

function __change_tag_of_host(tag) {
    host.action("script", {
        "script":"change_tag",
        "tag":tag,
        "close-popup":"yes"
    });
}

function __reload_history_showcase() {
    var showcase = view.object("showcase.history");

    showcase.action("reload");
}

function __remove_history_cell(tag) {
    var showcase = view.object("showcase.history");
    var identifier = "S_TAGS.HISTORY_" + tag;

    showcase.action("remove", { "display-unit":identifier });
}

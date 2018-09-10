function select_app(data) {
    controller.action("app", {
        "app":data["app"],
        "version":data["version"],
        "url":data["file"]
    });
}

function edit_apps() {
    var showcase = view.object("showcase.apps");

    showcase.action("edit");
}

function edit_done() {
    var showcase = view.object("showcase.apps");

    showcase.action("edit-done");
}

function select_all() {
    var showcase = view.object("showcase.apps");

    showcase.action("select-all");
}

function deselect_all() {
    var showcase = view.object("showcase.apps");

    showcase.action("deselect-all");
}

function remove_apps() {
    var showcase = view.object("showcase.apps");

    showcase.action("remove");
}

function on_change_data(id, data) {
    view.action("reload");
}

function show_me() {
    controller.catalog().submit("showcase", "auxiliary", "S_USER.ME", {
        "username":$data["username"],
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER.ME", "target":"popup" });
}

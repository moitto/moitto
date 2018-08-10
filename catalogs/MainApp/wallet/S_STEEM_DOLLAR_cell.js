function on_change_data(id, data) {
    view.data("display-unit", { "amount":data["sbd-balance"] });
    view.action("reload");
}

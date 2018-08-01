function on_change_data(identifier, data) {
    view.data("display-unit", { "amount":data["sbd-balance"] });
    view.action("reload");
}

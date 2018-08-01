function on_change_data(identifier, data) {
    view.data("display-unit", { "amount":data["steem-power"] });
    view.action("reload");
}

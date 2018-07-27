function on_change_data(data) {
    view.data("display-unit", { "amount":data["steem-power"] });
    view.action("reload");
}

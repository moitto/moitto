function on_change_data(id, data) {
    view.data("display-unit", { "amount":data["steem-balance"] });
    view.action("reload");
}

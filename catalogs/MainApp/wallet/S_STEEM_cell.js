function on_change_data(data) {
    view.data("display-unit", { "amount":data["steem-balance"] });
    view.action("reload");
}

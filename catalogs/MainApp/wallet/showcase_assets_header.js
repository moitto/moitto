function on_change_data(id, data) {
    if (data["has-rewards"] === $data["has-rewards"]) {
        view.action("reload");
    }
}

function redeem_rewards() {
    owner.action("script", { "script":"redeem_rewards" });
}

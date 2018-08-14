function on_change_data(id, data) {
    if ((data["has-rewards"] && !$data["has-rewards"]) || (!data["has-rewards"] && $data["has-rewards"])) {
        owner.action("reload-header");
    } else {
        view.action("reload");
    }
}

function redeem_rewards() {
    owner.action("script", { "script":"redeem_rewards" });
}

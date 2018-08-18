var __has_rewards = null;

function on_loaded() {
    __has_rewards = $data["has-rewards"];
}

function on_change_data(id, data) {
    if (data["has-rewards"] === __has_rewards) {
        view.action("reload");
    }
}

function redeem_rewards() {
    owner.action("script", { "script":"redeem_rewards" });
}

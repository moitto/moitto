function delegate() {
    controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE", {
        // TBD
    });

    controller.action("popup", { 
        "display-unit":"S_DELEGATE", 
        "alternate-name":"delegate.receiver.select" 
    });
}

function on_change_data(id, data) {
    view.data("display-unit", { "amount":data["steem-power"] });
    view.action("reload");
}

function delegate() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_DELEGATE");
    controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE", {
    });

    controller.action("popup", { 
        "display-unit":"S_DELEGATE", 
        "alternate-name":"delegate.receiver.select"
    });
}

function power_down() {
    controller.action("subview", { 
        "subview":"V_POWER.DOWN", 
        "target":"popup",
        "close-popup":"yes"
    });
}

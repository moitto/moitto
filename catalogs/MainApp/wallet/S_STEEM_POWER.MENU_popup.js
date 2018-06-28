function delegate() {
    controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE", {
        // TBD
    });

    controller.action("popup", { 
        "display-unit":"S_DELEGATE", 
        "alternate-name":"delegate.receiver.select" 
    });
}

function power_down() {
    controller.catalog().submit("showcase", "auxiliary", "S_POWER_DOWN", {
        // TBD
    });

    controller.action("subview", { 
        "subview":"V_POWER_DOWN",
        "target":"popup",
        "close-popup":"yes"
    });
}

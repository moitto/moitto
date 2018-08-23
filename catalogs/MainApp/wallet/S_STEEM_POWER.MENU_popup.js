function delegate() {
    controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE", {
        "coin":"SP"
    });

    controller.action("popup", { 
        "display-unit":"S_DELEGATE", 
        "alternate-name":"delegate.receiver.select" 
    });
}

function undelegate() {
    controller.catalog().submit("showcase", "auxiliary", "S_UNDELEGATE", {
        "coin":"SP"
    });

    controller.action("popup", { 
        "display-unit":"S_UNDELEGATE", 
        "alternate-name":"undelegate.receiver.select" 
    });
}

function power_down() {
    controller.catalog().submit("showcase", "auxiliary", "S_POWER_DOWN", {
        "coin":"SP"
    });

    controller.action("subview", { 
        "subview":"V_POWER_DOWN",
        "target":"popup",
        "close-popup":"yes"
    });
}

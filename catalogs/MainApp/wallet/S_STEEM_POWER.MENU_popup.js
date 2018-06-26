function delegate() {
    controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE", {
        // TBD
    });

    controller.action("popup", { 
        "display-unit":"S_DELEGATE", 
        "alternate-name":"delegate.receiver.select" 
    });
}

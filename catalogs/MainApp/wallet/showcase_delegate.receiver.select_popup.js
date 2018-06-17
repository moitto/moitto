function delegate(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_DELEGATE");
    controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE", Object.assign(value, {
        "to":form["username"],
        "fetched":"no"
    }));

    controller.action("popup", { 
        "display-unit":"S_DELEGATE", 
        "alternate-name":"delegate.receiver.verify"
    });
}

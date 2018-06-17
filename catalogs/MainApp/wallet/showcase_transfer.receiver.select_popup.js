function transfer(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", Object.assign(value, {
        "to":form["username"],
        "fetched":"no"
    }));

    controller.action("popup", { 
        "display-unit":"S_TRANSFER", 
        "alternate-name":"transfer.receiver.verify"
    });
}

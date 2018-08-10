function undelegate(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_UNDELEGATE");
    controller.catalog().submit("showcase", "auxiliary", "S_UNDELEGATE", Object.assign(value, {
        "from":form["username"],
        "fetched":"no"
    }));

    controller.action("popup", { 
        "display-unit":"S_UNDELEGATE", 
        "alternate-name":"undelegate.receiver.verify"
    });
}

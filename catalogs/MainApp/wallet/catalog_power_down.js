function power_down(form) {
    controller.action("script", {
        "script":"actions.power_down",
        "subview":"__MAIN__",
        "routes-to-topmost":"no",
        "coin":form["coin"] || "SP",
        "amount":form["amount"]
    });
}

function power_down(form) {
    controller.action("script", {
        "script":"actions.power_down",
        "subview":"__MAIN__",
        "coin":form["coin"] || "SP",
        "amount":form["amount"]
    });
}

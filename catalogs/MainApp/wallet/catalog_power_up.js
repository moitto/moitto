function power_up(form) {
    controller.action("script", {
        "script":"actions.power_up",
        "subview":"__MAIN__",
        "routes-to-topmost":"no",
        "coin":form["coin"] || "STEEM",
        "amount":form["amount"]
    });
}

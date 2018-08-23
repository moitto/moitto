function power_up(form) {
    controller.action("script", {
        "script":"actions.power_up",
        "subview":"__MAIN__",
        "coin":form["coin"] || "STEEM",
        "amount":form["amount"]
    });
}

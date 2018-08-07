var wallet = require("wallet");

function power_up(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_POWER_UP");

    controller.action("script", {
        "script":"actions.power_up",
        "subview":"__MAIN__",
        "amount":form["amount"]
    });
}

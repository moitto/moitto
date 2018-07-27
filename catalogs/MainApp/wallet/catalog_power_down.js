var wallet = require("wallet");

function power_down(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_POWER_DOWN");

    controller.action("script", {
        "script":"power_down",
        "subview":"__MAIN__",
        "amount":form["amount"]
    });
}

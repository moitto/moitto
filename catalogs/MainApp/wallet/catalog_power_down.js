var wallet = require("wallet");

function power_down(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_POWER_DOWN");
    var amount = parseFloat(form["amount"]);

    wallet.power_down(amount, function(response) {
    });
}

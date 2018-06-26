var wallet = require("wallet");

function power_up(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_POWER.UP");
    var amount = parseFloat(form["amount"]);

    wallet.power_up(amount, function(response) {
    });
}

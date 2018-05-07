var account = require("account");

function send(form) {
    var amount = parseFloat(form["amount"]).toFixed(3);

    controller.action("freeze", { message:"전송 중..." });
    account.transfer(form["username"], amount + " SBD", form["memo"], function(response) {
        controller.action("popup", { "display-unit":"S_TRANSFER_DONE" });
        controller.action("unfreeze");
    });
}

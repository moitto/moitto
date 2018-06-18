var account = require("account");

function on_loaded() {
    if ($data["status"] === "progress") {
        account.claim_rewards(function(response) {
            controller.catalog().submit("showcase", "auxiliary", "S_REDEEM", {
                "status":response ? "done" : "failed"
            });

            controller.action("popup", { "display-unit":"S_REDEEM" });
        });

        return;
    }
}

function redeem() {
    controller.catalog().submit("showcase", "auxiliary", "S_REDEEM", {
        "status":"progress"
    });

    controller.action("popup", { "display-unit":"S_REDEEM" });
}

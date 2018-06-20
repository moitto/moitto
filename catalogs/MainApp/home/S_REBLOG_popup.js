var account = require("account");

function on_loaded() {
    if ($data["status"] === "progress") {
        account.reblog($data["author"], $data["permlink"], function(response) {
            controller.catalog().submit("showcase", "auxiliary", "S_REBLOG", {
                "status":response ? "done" : "failed"
            });

            controller.action("popup", { "display-unit":"S_REBLOG" });
        });

        return;
    }
}

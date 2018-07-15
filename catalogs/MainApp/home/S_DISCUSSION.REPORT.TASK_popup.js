var reports = require("reports");

function on_loaded() {
    if ($data["status"] === "progress") {
        reports.report_content($data["author"], $data["permlink"], $data["reason"], function(response) {
            controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.REPORT.TASK", {
                "status":response ? "done" : "failed"
            });

            controller.action("popup", { "display-unit":"S_DISCUSSION.REPORT.TASK" });
        });        
    }
}

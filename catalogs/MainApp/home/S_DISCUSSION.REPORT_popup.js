function report(form) {
    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.REPORT.TASK", {
        "author":$data["author"],
        "permlink":$data["permlink"],
        "reason":form["reason"],
        "status":"progress"
    });

    controller.action("popup", { "display-unit":"S_DISCUSSION.REPORT.TASK" });
}

function transfer() {
    controller.catalog().remove("showcase", "auxiliary", "S_TRANSFER");
    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", {
        "currency":"SBD"
    });

    controller.action("page", { "display-unit":"S_RECEIVERS" });
}

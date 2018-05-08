function show_user() {
    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":$data["author"]
    });

    controller.action("page", { "display-unit":"S_USER", "target":"popup" })
}

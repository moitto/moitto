function show_user() {
    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":$data["author"],
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER", "target":"popup" })
}

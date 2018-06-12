function remove() {
    owner.action("script", {
        "script":"remove_tag",
        "tag":$data["tag"]
    });
}

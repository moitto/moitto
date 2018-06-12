function change_tag(form) {
    var tag = form.tag.trim();

    __save_tag(tag);

    host.action("script", {
        "script":"change_tag",
        "tag":tag,
        "close-popup":"yes"
    });
}

function __save_tag(tag) {

}

var users = require("users");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_UNDELEGATE");
    var user = users.create(value["from"]);

    __update_userpic(user);
}

function undelegate(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_UNDELEGATE");

    controller.action("script", {
        "script":"actions.undelegate",
        "subview":"__MAIN__",
        "routes-to-topmost":"no",
        "from":value["from"]
    });
}

function __update_userpic(user) {
    var image = view.object("img.userpic");

    image.property({ 
        "image-url":user.get_userpic_url() 
    });
}

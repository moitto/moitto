var users = require("users");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_DELEGATE");
    var user = users.create(value["to"]);

    __update_to_userpic(user);
}

function delegate(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_DELEGATE");

    controller.action("script", {
        "script":"delegate",
        "subview":"__MAIN__",
        "to":value["to"],
        "amount":form["amount"]
    });
}

function __update_to_userpic(user) {
    var image = view.object("img.to.userpic");

    image.property({ 
        "image-url":user.get_userpic_url() 
    });
}

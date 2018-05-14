var users = require("users");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    var user = users.create(value["receiver"]);
    
    __update_userpic(user);
}

function __update_userpic(user) {
    var image = view.object("img.receiver.userpic");
    var userpic_url = user.get_userpic_url();

    image.property({ "image-url":userpic_url });
}

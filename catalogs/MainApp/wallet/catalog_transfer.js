var users = require("users");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    var user = users.create(value["to"]);
    
    __update_userpic(user);
}

function feed_users(keyword, location, length, sortkey, sortorder, handler) {

}

function choose_user(form) {
    
}

function __update_userpic(user) {
    var image = view.object("img.to.userpic");
    var userpic_url = user.get_userpic_url();

    image.property({ "image-url":userpic_url });
}

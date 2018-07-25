var wallet  = require("wallet");
var users   = wallet.account.global.users;

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_DELEGATE");
    var user = users.create(value["to"]);

    __update_to_userpic(user);
}

function delegate(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_DELEGATE");
    var amount = parseFloat(form["amount"]);

    wallet.delegate(value["to"], amount, function(response) {
        // TBD
    });
}

function __update_to_userpic(user) {
    var image = view.object("img.to.userpic");

    image.property({ 
        "image-url":user.get_userpic_url() 
    });
}

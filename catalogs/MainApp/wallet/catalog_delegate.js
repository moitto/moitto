var users  = require("users");
var wallet = require("wallet");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_DELEGATE");

    __update_to_userpic(users.create(value["to"]));
}

function delegate(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_DELEGATE");
    var amount = parseFloat(form["amount"]);

    wallet.delegate(value["to"], amount, function(response) {
        console.log("==============");
        console.log(JSON.stringify(response));
    });
}

function __update_to_userpic(user) {
    var image = view.object("img.to.userpic");

    image.property({ 
        "image-url":user.get_userpic_url() 
    });
}

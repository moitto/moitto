var users      = require("users");
var currencies = require("currencies");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    var user = users.create(value["to"]);
    
    __update_userpic(user);
}

function feed_users(keyword, location, length, sortkey, sortorder, handler) {

}

function choose_user(form) {
    
}

function choose_currency() {
    controller.action("popup", { 
        "display-unit":"S_TRANSFER",
        "alternate-name":"transfer.currency"
    });
}

function on_choose_currency() {
    var amount_type = document.value("WALLET.AMOUNT.TYPE");

    if (amount_type) {
        var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    
        if (value["amount-type"] !== amount_type) {
            controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", Object.assign(value, {
                "amount-type":amount_type
            }));

            controller.action("reload");
        }
    }

    document.value("WALLET.AMOUNT.TYPE", null);
}

function confirm_transfer(form) {   
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");

    controller.action("freeze"); 
    currencies.get_current_price(value["currency"], value["coin"], function(price) {
        var amount = parseFloat(form["amount"]);
        var currency_amount = (value["amount-type"] === value["currency"]) ? amount : amount * price;
        var coin_amount     = (value["amount-type"] === value["coin"]    ) ? amount : amount / price;

        controller.action("unfreeze");
        controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", Object.assign(value, {
            "currency-amount":currency_amount.toFixed(1).toString(),
            "coin-amount":coin_amount.toFixed(3).toString()
        }));

        controller.action("popup", { 
            "display-unit":"S_TRANSFER",
            "alternate-name":"transfer.confirm"
        });
    });
}

function __update_userpic(user) {
    var image = view.object("img.to.userpic");
    var userpic_url = user.get_userpic_url();

    image.property({ "image-url":userpic_url });
}

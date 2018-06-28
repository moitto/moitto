var users   = require("users");
var account = require("account");
var wallet  = require("wallet");

var __amount_to_transfer = null;
var __current_coin_price = null;

var __coin_to_transfer = null;
var __amount_type      = null; 

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    var user = users.create(value["to"]);

    __update_to_userpic(user);
    
    __coin_to_transfer = value["coin"];
    __amount_type      = value["amount-type"]; 
    
    wallet.get_coin_price(value["currency"], value["coin"], function(price) {
        __current_coin_price = price;

        __update_coin_amount();
    });
}

function on_change_amount() {
    if (__current_coin_price) {
        __update_coin_amount();
    }
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

        storage.value(value["coin"] + ".AMOUNT-TYPE", amount_type);
    }

    document.value("WALLET.AMOUNT.TYPE", null);
}

function transfer(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    var amount = parseFloat(form["amount"]);

    if (value["amount-type"] !== value["coin"]) {
        if (!__current_coin_price) {
            wallet.get_coin_price(value["currency"], value["coin"], function(price) {
                __transfer(value["to"], value["coin"], amount / price);
            });
        } else {
            __transfer(value["to"], value["coin"], amount / __current_coin_price);
        }
    } else {
        __transfer(value["to"], value["coin"], amount);
    }
}

function __transfer(to, coin, amount) {
    wallet.transfer(to, coin, amount, "", function(response) {
        // TBD
    });
}

function __update_to_userpic(user) {
    var image = view.object("img.to.userpic");

    image.property({ 
        "image-url":user.get_userpic_url() 
    });
}

function __update_coin_amount() {
    if (__amount_type !== __coin_to_transfer) {
        var currency_amount = parseFloat(view.object("amount").value() || "0");
        var coin_amount = (currency_amount / __current_coin_price).toFixed(3);

        view.object("label.amount.coin").property({ "text":coin_amount.toString() + " " +  __coin_to_transfer });
    }
}

var users   = require("users");
var account = require("account");
var wallet  = require("wallet");
var steemjs = require("steemjs");

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
    }

    document.value("WALLET.AMOUNT.TYPE", null);
}

function confirm_transfer(form) {   
    __confirm_transfer(parseFloat(form["amount"]));
}

function __confirm_transfer(amount) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");

    controller.action("freeze");
    currencies.get_current_price(value["currency"], value["coin"], function(price) {
        var currency_amount = (value["amount-type"] === value["currency"]) ? amount : amount * price;
        var coin_amount     = (value["amount-type"] === value["coin"]    ) ? amount : amount / price;
        var remittance = coin_amount.toFixed(3) + " " + value["coin"];
        var wrong_count = storage.value("WALLET.WRONG_PIN_COUNT") || 0;
            
        if (value["amount-type"] === value["currency"]) {
            remittance = currency_amount.toFixed(1).toString() + " " + value["currency"] + "(" + remittance + ")";
        }

        controller.action("unfreeze");

        if (wrong_count < 5) {
            controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
                "message":"암호를 입력하면 " + remittance + "를 송금합니다.",
                "status":"normal",
                "script":"__on_receive_pin"
            });

            controller.action("popup", { "display-unit":"S_PIN" });
        } else {
            controller.catalog().submit("showcase", "auxiliary", "S_RESET_PIN", {
                "message":"5회 연속 암호를 틀려서 사용 중지된 상태입니다. 다시 사용하시려면 스팀 비밀번호를 입력하여 암호를 재설정해주세요.", 
                "script":"__on_reset_pin"
            });
 
            controller.action("popup", { "display-unit":"S_RESET_PIN" });
        }
    });

    __amount_to_transfer = amount;
}

function __on_receive_pin() {
    var me = storage.value("ACTIVE_USER");
    var pin = document.value("WALLET.PIN");

    steemjs.get_accounts([ me ]).then(function(response) {
        var owner_key = response[0] ? response[0]["owner"]["key_auths"][0][0] : "";

        if (account.verify_pubkey(owner_key, pin)) {
            storage.value("WALLET.WRONG_PIN_COUNT", 0);


        } else {
            var wrong_count = (storage.value("WALLET.WRONG_PIN_COUNT") || 0) + 1;

            if (wrong_count < 5) {
                controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
                    "message":"암호가 올바르지 않습니다. 다시 한번 암호를 입력하세요.\\n(현재 " + wrong_count + "회 틀림/5회 연속 틀릴 시 사용 중지)", 
                    "status":"error",
                    "script":"__on_receive_pin"
                });

                controller.action("popup", { "display-unit":"S_PIN" });
            } else {
                controller.catalog().submit("showcase", "auxiliary", "S_RESET_PIN", {
                    "message":"5회 연속 암호를 틀려서 사용이 중지되었습니다. 다시 사용하시려면 스팀 비밀번호를 입력하여 암호를 재설정해주세요.", 
                    "script":"__on_reset_pin"
                });
 
                 controller.action("popup", { "display-unit":"S_RESET_PIN" });
            }
            
            storage.value("WALLET.WRONG_PIN_COUNT", wrong_count);
        }
    }, function(reason) {

    });
}

function __on_reset_pin() {
    storage.value("WALLET.WRONG_PIN_COUNT", 0);

    __confirm_transfer(__amount_to_transfer);
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

Wallet = (function() {
    return {
        __transaction:null,
        __max_wrong_count:5,
        __pin_to_verify:null
    };
})();

Wallet.account = require("account"); 
Wallet.upbit   = require("upbit");

Wallet.register_pin = function(handler) {
    Wallet.__transaction = {
        "action":"register_pin",
        "handler":handler
    };

    Wallet.__register_pin();
}

Wallet.transfer = function(to, coin, amount, handler) {
    var wrong_count = storage.value("WALLET.WRONG_PIN_COUNT") || 0;
    
    if (wrong_count < Wallet.__max_wrong_count) {
        Wallet.__confirm_transfer(to, amount.toFixed(3) + " " + coin);
    } else {
        Wallet.__reset_pin();
    }

    Wallet.__transaction = {
        "action":"transfer",
        "to":to,
        "amount":amount.toFixed(3) + " " + coin,
        "handler":handler
    };
}

Wallet.get_coin_price = function(currency, coin, handler) {
    Wallet.upbit.get_candles(currency, coin, 1, function(candles) {
        if (candles) {
            handler(candles[0]["tradePrice"]);
        } else {
            handler();
        }
    });
}

Wallet.__register_pin = function() {
    controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
        "title":"암호 설정",
        "message":"송금, 임대 등에 사용할 암호를 설정하세요.",
        "status":"normal",
        "close-disabled":"yes",
        "reset-disabled":"yes",
        "skip-enabled":"yes",
        "script":"Wallet.__on_receive_pin"
    });

    controller.action("popup", { "display-unit":"S_PIN" });
}

Wallet.__confirm_transfer = function(to, amount) {
    controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
        "title":"암호 입력",
        "message":"암호를 입력하면 =[amount|" + amount + "]=를 송금합니다.",
        "status":"normal",
        "script":"Wallet.__on_receive_pin"
    });

    controller.action("popup", { "display-unit":"S_PIN" });
}

Wallet.__verify_pin = function() {
    controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
        "title":"암호 설정",
        "message":"암호를 다시 한번 입력하세요.", 
        "status":"normal",
        "close-disabled":"yes",
        "reset-disabled":"yes",
        "skip-enabled":"yes",
        "script":"Wallet.__on_receive_pin_again"
    });

    controller.action("popup", { "display-unit":"S_PIN" });
}

Wallet.__on_receive_pin = function() {
    var wrong_count = storage.value("WALLET.WRONG_PIN_COUNT") || 0;
    var pin = document.value("WALLET.PIN");

    console.log("__on_receive_pin: " + pin);

    if (Wallet.__transaction["action"] !== "register_pin") {
        if (Wallet.account.verify_pin(pin)) {
            Wallet.__process_transaction();
        } else {
            Wallet.__retry_confirm_transfer(wrong_count + 1);
        }
    } else {
        Wallet.__pin_to_verify = document.value("WALLET.PIN");

        if (!Wallet.__pin_to_verify) {
            if (Wallet.__transaction["handler"]) {
                Wallet.__transaction["handler"]();
            }
    
            Wallet.__transaction = null;
        } else {
            Wallet.__verify_pin();
        }
    }
}

Wallet.__on_receive_pin_again = function() {
    var pin = document.value("WALLET.PIN");

    if (pin === Wallet.__pin_to_verify) {
        if (Wallet.__transaction["handler"]) {
            Wallet.__transaction["handler"](pin);
        }
    
        document.value("WALLET.PIN", null);

        Wallet.__pin_to_verify = null;
        Wallet.__transaction = null;
    } else {
        controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
            "title":"암호 설정",
            "message":"암호가 일치하지 않습니다.\\n송금, 임대 등에 사용할 암호를 입력하세요.", 
            "status":"error",
            "close-disabled":"yes",
            "reset-disabled":"yes",
            "skip-enabled":"yes",
            "script":"Wallet.__on_receive_pin"
        });

        controller.action("popup", { "display-unit":"S_PIN" });
    }
}

Wallet.__retry_confirm_transfer = function(wrong_count) {
    controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
        "title":"암호 입력",
        "message":"암호가 올바르지 않습니다. 다시 한번 암호를 입력하세요.\\n(현재 " + wrong_count + "회 틀림/" + Wallet.__max_wrong_count  + "회 연속 틀릴 시 사용 중지)", 
        "status":"error",
        "script":"Wallet.__on_receive_pin"
    });

    storage.value("WALLET.WRONG_PIN_COUNT", wrong_count);
    controller.action("popup", { "display-unit":"S_PIN" });
}

Wallet.__reset_pin = function() {
    controller.catalog().submit("showcase", "auxiliary", "S_RESET_PIN", {
        "message":Wallet.max_wrong_count + "회 연속 암호를 틀려서 사용 중지된 상태입니다. 다시 사용하시려면 스팀 비밀번호나 액티브 키를 입력하여 암호를 재설정해주세요.", 
        "script":"Wallet.__on_reset_pin"
    });

    controller.action("popup", { "display-unit":"S_RESET_PIN" });
}

Wallet.__on_reset_pin = function() {

}

Wallet.__process_transaction = function() {

    storage.value("WALLET.WRONG_PIN_COUNT", 0);
}

__MODULE__ = Wallet;

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

Wallet.transfer = function(to, coin, amount, memo, handler) {
    amount = amount.toFixed(3) + " " + coin;

    Wallet.__transaction = {
        "action":"transfer",
        "to":to,
        "amount":amount,
        "memo":memo,
        "handler":handler
    };

    Wallet.__start_transfer(to, amount);
}

Wallet.delegate = function(to, amount, handler) {
    amount = amount.toFixed(3) + " " + "SP";

    Wallet.__transaction = {
        "action":"delegate",
        "to":to,
        "amount":amount,
        "handler":handler
    };

    Wallet.__start_delegate(to, amount);
}

Wallet.redeem_rewards = function(handler) {
    Wallet.__transaction = {
        "action":"redeem_rewards",
        "handler":handler
    };

    Wallet.__confirm_redeem();
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
        "title":"PIN번호 설정",
        "message":"송금, 임대 등에 사용할 PIN번호를 설정하세요.",
        "status":"normal",
        "close-disabled":"yes",
        "reset-disabled":"yes",
        "skip-enabled":"yes",
        "script":"Wallet.__on_receive_pin"
    });

    controller.action("popup", { "display-unit":"S_PIN" });
}

Wallet.__start_transfer = function(to, amount) {
    var wrong_count = storage.value("WALLET.WRONG_PIN_COUNT") || 0;
    
    if (wrong_count < Wallet.__max_wrong_count) {
        Wallet.__confirm_transfer(to, amount);
    } else {
        Wallet.__reset_pin();
    }
}

Wallet.__confirm_transfer = function(to, amount) {
    controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
        "title":"PIN번호 입력",
        "message":"PIN번호를 입력하면\\n=[amount|" + amount + "]=를 송금합니다.",
        "status":"normal",
        "script":"Wallet.__on_receive_pin"
    });

    controller.action("popup", { "display-unit":"S_PIN" });
}

Wallet.__start_delegate = function(to, amount) {
    var wrong_count = storage.value("WALLET.WRONG_PIN_COUNT") || 0;
    
    if (wrong_count < Wallet.__max_wrong_count) {
        Wallet.__confirm_delegate(to, amount);
    } else {
        Wallet.__reset_pin();
    }
}

Wallet.__confirm_delegate = function(to, amount) {
    controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
        "title":"PIN번호 입력",
        "message":"PIN번호를 입력하면\\n=[amount|" + amount + "]=를 임대합니다.",
        "status":"normal",
        "script":"Wallet.__on_receive_pin"
    });

    controller.action("popup", { "display-unit":"S_PIN" });
}

Wallet.__confirm_redeem = function() {
    controller.catalog().submit("showcase", "auxiliary", "S_REDEEM.TASK", {
        "status":"confirm",
        "script":"Wallet.__redeem_rewards"
    });

    controller.action("popup", { "display-unit":"S_REDEEM.TASK" });
}

Wallet.__redeem_rewards = function() {
    Wallet.account.claim_rewards(function(response) {
        controller.catalog().submit("showcase", "auxiliary", "S_REDEEM.TASK", {
            "status":response ? "done" : "failed"
        });

        controller.action("popup", { "display-unit":"S_REDEEM.TASK" });

        if (Wallet.__transaction["handler"]) {
            Wallet.__transaction["handler"](response);
        }

        Wallet.__transaction = null;
    });

    controller.catalog().submit("showcase", "auxiliary", "S_REDEEM.TASK", {
        "status":"progress"
    });

    controller.action("popup", { "display-unit":"S_REDEEM.TASK" });
}

Wallet.__verify_pin = function() {
    controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
        "title":"PIN번호 설정",
        "message":"PIN번호를 다시 입력하세요.",
        "status":"normal",
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
            Wallet.__process_transaction(pin);
 
            storage.value("WALLET.WRONG_PIN_COUNT", 0);
        } else {
            if (wrong_count + 1 < Wallet.__max_wrong_count) {
                Wallet.__retry_confirm_transfer(wrong_count + 1);
            } else {
                Wallet.__reset_pin();
            }
            
            storage.value("WALLET.WRONG_PIN_COUNT", wrong_count + 1);
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
            "title":"PIN번호 설정",
            "message":"PIN번호가 일치하지 않습니다.\\n송금, 임대 등에 사용할 PIN번호를 입력하세요.",
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
        "title":"PIN번호 입력",
        "message":"PIN번호를 잘못 입력했습니다.\\n다시 PIN번호를 입력하세요.\\n(현재 " + wrong_count + "회 틀림 / " + Wallet.__max_wrong_count  + "회 연속 틀리면 PIN번호를 재설정해야 합니다.)",
        "status":"error",
        "script":"Wallet.__on_receive_pin"
    });

    controller.action("popup", { "display-unit":"S_PIN" });
}

Wallet.__reset_pin = function() {
    controller.catalog().submit("showcase", "auxiliary", "S_RESET_PIN", {
        "message":Wallet.max_wrong_count + "회 연속 PIN번호를 잘못 입력하여 사용 중지됐습니다. 다시 사용하려면 스팀 비밀번호를 입력하여 PIN번호를 재설정해야 합니다.",
        "script":"Wallet.__on_reset_pin"
    });

    controller.action("popup", { "display-unit":"S_RESET_PIN" });
}

Wallet.__on_reset_pin = function() {

}

Wallet.__process_transaction = function(pin) {
    if (Wallet.__transaction["action"] == "transfer") {
        Wallet.__process_transfer(Wallet.__transaction, pin);

        return;
    }

    if (Wallet.__transaction["action"] == "delegate") {
        Wallet.__process_delegate(Wallet.__transaction, pin);

        return;
    }
}

Wallet.__process_transfer = function(transaction, pin) {
    var to     = transaction["to"];
    var amount = transaction["amount"];
    var memo   = transaction["memo"] || "";

    Wallet.account.transfer(to, amount, memo, pin, function(response) {
        controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER.TASK", {
            "status":response ? "done" : "failed"
        });

        controller.action("popup", { "display-unit":"S_TRANSFER.TASK" });

        if (transaction["handler"]) {
            transaction["handler"](response);
        }
    });

    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER.TASK", {
        "status":"progress"
    });

    controller.action("popup", { "display-unit":"S_TRANSFER.TASK" });
}

Wallet.__process_delegate = function(transaction, pin) {
    var to     = transaction["to"];
    var amount = transaction["amount"];

    Wallet.account.delegate_vesting(to, amount, pin, function(response) {
        controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE.TASK", {
            "status":response ? "done" : "failed"
        });

        controller.action("popup", { "display-unit":"S_DELEGATE.TASK" });

        if (transaction["handler"]) {
            transaction["handler"](response);
        }
    });

    controller.catalog().submit("showcase", "auxiliary", "S_DELEGATE.TASK", {
        "status":"progress"
    });

    controller.action("popup", { "display-unit":"S_DELEGATE.TASK" });
}

__MODULE__ = Wallet;

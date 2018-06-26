var account = require("account");
var wallet  = require("wallet");

function transfer() {
    if (wallet.registered_pin(storage.value("ACTIVE_USER"))) {
        show_transfer();
    } else {
        prompt_reset_pin();
    }
}

function reset_pin_force() {
    wallet.reset_pin_force(function(pin) {
        if (pin) {
            controller.action("toast", { "message":"PIN번호가 설정 되었습니다." });
        }

        controller.action("popup-close");
    });
}

function prompt_reset_pin() {
    controller.action("prompt", {
        "title": "알림",
        "message": "스팀달러를 송금을 하려면, PIN번호를 설정해주세요.",
        "has-cancel-button": "yes",
        "button-1": "PIN 설정하기;script;script=reset_pin_force"
    });
}

function show_transfer() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", {
        "amount-type":value["amount-type"] || "SBD",
        "coin":"SBD",
        "currency":"KRW"
    });

    controller.action("popup", { 
        "display-unit":"S_TRANSFER", 
        "alternate-name":"transfer.receiver.select",
        "has-own-sbml":"no"
    });
}
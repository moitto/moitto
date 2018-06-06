var account = require("account");
var users   = require("users");

var __login_handler = null;
var __pin_to_verify = null;

function login(form) {
    controller.action("freeze", { message:"로그인 중..." });

    account.login(form["username"], form["password"], function(response, handler) {
        if (!response) {
            console.log("FAILED!!!!");
            controller.action("alert", { message:"스팀잇 계정과 비밀번호가 일치하지 않습니다." });
            controller.action("unfreeze");
    
            return;
        }

        controller.action("unfreeze");

        __login_handler = handler;
        __request_pin();
    });
}

function __request_pin() {
    controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
        "message":"송금, 임대 등에 사용할 암호를 입력하세요.",
        "status":"normal",
        "close-disabled":"yes",
        "reset-disabled":"yes",
        "skip-enabled":"yes",
        "script":"__on_receive_pin"
    });

    controller.action("popup", { "display-unit":"S_PIN" });
}

function __on_receive_pin() {
    __pin_to_verify = document.value("WALLET.PIN");

    if (__pin_to_verify) {
        controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
            "message":"암호를 다시 한번 입력하세요.", 
            "status":"normal",
            "close-disabled":"yes",
            "reset-disabled":"yes",
            "skip-enabled":"yes",
            "script":"__on_receive_pin_again"
        });

        controller.action("popup", { "display-unit":"S_PIN" });        
    } else {
        __show_welcome_message();
    }
}

function __on_receive_pin_again() {
    var pin = document.value("WALLET.PIN");

    if (pin === __pin_to_verify) {
        __login_handler(pin);

        document.value("WALLET.PIN", null);

        __login_handler = null;
        __pin_to_verify = null;

        __show_welcome_message();
    } else {
        controller.catalog().submit("showcase", "auxiliary", "S_PIN", {
            "message":"암호가 일치하지 않습니다.\\n송금, 임대 등에 사용할 암호를 입력하세요.", 
            "status":"error",
            "close-disabled":"yes",
            "reset-disabled":"yes",
            "skip-enabled":"yes",
            "script":"__on_receive_pin"
        });

        controller.action("popup", { "display-unit":"S_PIN" });
    }
}

function __show_welcome_message() {
        var user = users.create(account.username);

        controller.catalog().submit("showcase", "auxiliary", "S_WELCOME", {
            "username":user.name, 
            "userpic-url":user.get_userpic_url()
        });

        controller.action("popup", { "display-unit":"S_WELCOME" });
}
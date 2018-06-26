var account = require("account");
var wallet  = require("wallet");
var users   = require("users");

var __login_handler = null;
var __pin_to_verify = null;

function login(form) {
    controller.action("freeze", { message:"로그인 중..." });

    account.login(form["username"].trim(), form["password"], function(response, handler) {
        if (!response) {
            controller.action("alert", { message:"스팀 계정과 비밀번호가 일치하지 않습니다." });
            controller.action("unfreeze");
    
            return;
        }

        controller.action("unfreeze");

        wallet.register_pin(function(pin) {
            if (pin) {
                handler(pin);
            }

            __show_welcome_message(form["username"]);
        });
    });
}

function __show_welcome_message(username) {
    var user = users.create(username);

    controller.catalog().submit("showcase", "auxiliary", "S_WELCOME", {
        "username":user.name, 
        "userpic-url":user.get_userpic_url()
    });

    controller.action("popup", { "display-unit":"S_WELCOME" });
}

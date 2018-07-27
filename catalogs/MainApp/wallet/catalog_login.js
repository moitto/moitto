var wallet  = require("wallet");
var account = require("account");
var users   = require("users");

function login(form) {
    var username = form["username"].trim();
    var password = form["password"].trim();

    controller.action("freeze", { message:"로그인 중..." });

    account.login(username, password, function(keys, needs_pin, handler) {
        if (!keys) {
            controller.action("alert", { message:"스팀 계정과 비밀번호 혹은 포스팅 키가 일치하지 않습니다." });
            controller.action("unfreeze");
    
            return;
        }

        controller.action("unfreeze");

        if (needs_pin) {
            wallet.register_pin(function(pin) {
                if (pin) {
                    handler(pin);
                }

                __show_welcome_message(username);
            });            
        } else {
            __show_welcome_message(username);
        }
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

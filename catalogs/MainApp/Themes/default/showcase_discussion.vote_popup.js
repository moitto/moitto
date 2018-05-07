var account = require("account");

function on_loaded() {
    
}

function vote(form) {
    account.vote($data["author"], $data["permlink"], 10000, function(response) {
        view.data("display-unit", { "voted":"yes" });

        controller.action("toast", { message:"보팅했습니다." });
        controller.action("popup-close");
    });
}

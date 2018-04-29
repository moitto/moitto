var account = require("account");

function vote(form) {
	account.vote($data["author"], $data["permlink"], 10000, function(response) {
		controller.action("toast", { message:"보팅했습니다." });
        controller.action("popup-close");
	});
}

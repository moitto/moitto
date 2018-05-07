var account = require("account");

function vote(form) {
	view.data("display-unit", {
		"voted":"yes"
	});

	//account.vote($data["author"], $data["permlink"], 10000, function(response) {
	//	controller.action("toast", { message:"보팅했습니다." });
    //  controller.action("popup-close");
	//});
}

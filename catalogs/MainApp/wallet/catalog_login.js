var account = require("account");

function login(form) {
	controller.action("freeze", { message:"로그인 중..." });

    account.login(form["username"], form["password"], function(response) {
    	if (!response) {
    		controller.action("alert", { message:"스팀잇 계정과 비밀번호가 일치하지 않습니다." });
			controller.action("unfreeze");
	
    		return;
    	}

    	controller.action("toast", { message:"로그인에 성공했습니다!" });
		controller.action("unfreeze");

		[ "V_HOME", "V_WALLET", "V_NOTIFY" ].forEach(function(subview) {
			controller.action("reload", { target:"catalog", subview:subview });
		});
    	controller.action("subview-back");
    });
}

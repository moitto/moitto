var account = require("account");
var wallet  = require("wallet");
var users   = require("users");

function reset_pin_force() {
	wallet.reset_pin_force(function(pin) {
		if (pin) {
			controller.action("toast", { "message":"PIN번호가 설정 되었습니다." });
		}
		controller.action("popup-close");
	});
}

function prompt_logout() {
	controller.action("prompt", {
		"title": "로그아웃",
		"message": "로그아웃하시겠습니까?",
		"has-cancel-button": "yes",
		"button-1": "로그아웃;script;script=logout"
	});
}

function prompt_clear_cache() {
	controller.action("prompt", {
		"title": "캐시 삭제",
		"message": "임시로 저장됐던 파일을 삭제하시겠습니까?",
		"has-cancel-button": "yes",
		"button-1": "확인;script;script=clear_cache"
	});
}

function logout() {
	account.logout(function() {
		controller.catalog().submit("showcase", "auxiliary", "S_SETTINGS", {
			"logged-in":account.is_logged_in() ? "yes" : "no"
		});

		[ "V_HOME", "V_NOTIF", "V_WALLET" ].forEach(function(subview) {
        	controller.action("reload", { "target":"catalog", "subview":subview });
		});

		controller.action("reload");
	    controller.action("script", { "script":"reset_notif", "subview":"__MAIN__" });
	});
}

function clear_cache() {
	controller.action("clear-cache");
}

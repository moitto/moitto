var account = require("account");
var wallet  = require("wallet");
var users   = require("users");

function pin_button_pressed() {
	wallet.reset_pin_force(function(pin) {
	});
}

function logout_button_pressed() {
	controller.action("prompt", {
		"title": "로그아웃",
		"message": "로그아웃하시겠습니까?",
		"has-cancel-button": "yes",
		"button-1": "로그아웃;script;script=logout"
	});
}

function cache_button_pressed() {
	controller.action("prompt", {
		"title": "캐시 삭제",
		"message": "임시로 저장됐던 파일을 삭제하시겠습니까?",
		"has-cancel-button": "yes",
		"button-1": "확인;script;script=clear_cache"
	});
}

function logout() {
	account.logout(function() {
		controller.catalog().submit("showcase", "auxiliary", "S_ACCOUNT", {
			"logged-in":account.is_logged_in() ? "yes" : "no"
		});

		controller.action("reload");
		controller.action("reload", { "subview":"V_WALLET" });
		controller.action("reload", { "subview":"V_NOTIF" });
		controller.action("reload", { "subview":"V_HOME" });
	});
}

function clear_cache() {
	controller.action("clear-cache");
}

function show_pin() {
	wallet.reset_pin_force(function(pin) {
        if (pin) {
 	       console.log("pin" + pin);
        }
    });
}

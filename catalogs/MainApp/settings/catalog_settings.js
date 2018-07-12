var account  = require("account");
var settings = require("settings");
var users    = require("users");

function on_loaded() {
	if (settings.nsfw_contents_allowed()) {
		__deselect_nsfw_button();
	} else {
		__select_nsfw_button();
	}
}

function reset_pin_force() {
	settings.reset_pin_force(function(pin) {
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

function toggle_nsfw_lock() {
	if (settings.is_pin_registered()) {
		if (settings.nsfw_contents_allowed()) {
			settings.disallow_nsfw_contents(function() {
				__select_nsfw_button();

				controller.action("toast", { "message":"#NSFW 글이 보이지 않습니다." });
			});
		} else {
			settings.allow_nsfw_contents(function() {
				__deselect_nsfw_button();

				controller.action("toast", { "message":"#NSFW 글이 보입니다." });
			});
		}
	} else {
		if (account.is_logged_in()) {
			__prompt_register_pin();
		} else {
			__prompt_login();
		}
	}
}

function __prompt_login() {
	controller.action("prompt", {
		"title": "알림",
		"message": "NSFW 설정을 변경하려면 로그인을 하셔야 합니다. 로그인 하시겠습니까?",
		"has-cancel-button": "yes",
		"button-1": "로그인하기;subview;subview=V_LOGIN,target=popup"
	});
}

function __prompt_register_pin() {
	controller.action("prompt", {
		"title": "알림",
		"message": "NSFW 설정을 변경하려면 핀번호를 설정하셔야 합니다. 핀번호를 설정하시겠습니까?",
		"has-cancel-button": "yes",
		"button-1": "설정하기;script;script=reset_pin_force"
	});
}

function __select_nsfw_button() {
	var button = view.object("btn.nsfw");

	button.property({ "selected":"yes" });
}

function __deselect_nsfw_button() {
	var button = view.object("btn.nsfw");

	button.property({ "selected":"no" });
}


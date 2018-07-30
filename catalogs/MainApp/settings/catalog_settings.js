var account  = require("account");
var settings = require("settings");
var wallet   = require("wallet");
var users    = require("users");

function on_loaded() {
	if (settings.nsfw_contents_allowed()) {
		__deselect_nsfw_button();
	} else {
		__select_nsfw_button();
	}
}

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
			"logged-in":"no"
		});

		__reload_subviews([ "V_HOME", "V_NOTIF", "V_WALLET" ]);

		controller.action("reload");
	    controller.action("script", { "script":"reset_notif", "subview":"__MAIN__" });
	});
}

function clear_cache() {
	controller.action("clear-cache");
}

function toggle_nsfw_lock() {
	if (wallet.is_pin_registered()) {
		if (settings.nsfw_contents_allowed()) {
    		wallet.verify_pin("PIN번호를 입력하면 #NSFW 글을 보이지 않게 합니다.", function(pin) {
    			settings.disallow_nsfw_contents();

				__reload_subviews([ "V_HOME", "V_TREND" ]);
				__select_nsfw_button();

				controller.action("toast", { "message":"#NSFW 글이 보이지 않습니다." });
    		});
		} else {
    		wallet.verify_pin("PIN번호를 입력하면 #NSFW 글을 보이도록 합니다.", function(pin) {
        		settings.allow_nsfw_contents();

				__reload_subviews([ "V_HOME", "V_TREND" ]);
				__deselect_nsfw_button();

				controller.action("toast", { "message":"#NSFW 글이 보입니다." });
		    });
		}
	} else {
		if (account.is_logged_in()) {
			controller.action("prompt", {
				"title": "알림",
				"message": "NSFW 설정을 변경하려면 PIN번호를 설정해야 합니다. PIN번호를 설정하시겠습니까?",
				"has-cancel-button": "yes",
				"button-1": "PIN번호 설정;script;script=reset_pin_force"
			});
		} else {
			controller.action("prompt", {
				"title": "알림",
				"message": "NSFW 설정을 변경하려면 로그인을 해야 합니다. 로그인 하시겠습니까?",
				"has-cancel-button": "yes",
				"button-1": "로그인하기;subview;subview=V_LOGIN,target=popup"
			});
		}
	}
}

function __reload_subviews(subviews) {
	subviews.forEach(function(subview) {
        controller.action("reload", { "target":"catalog", "subview":subview });
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


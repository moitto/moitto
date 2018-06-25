var account = require("account");

function login_button_pressed() {

}

function logout_button_pressed() {
	controller.action("prompt", {
		"title": "logout title message",
		"message": "logout message~~",
		"has-cancel-button": "yes",
		"button-1": "로그아웃;script;script=logout"
	});
}

function cache_button_pressed() {
	controller.action("prompt", {
		"title": "title message",
		"message": "cache message~~",
		"has-cancel-button": "yes",
		"button-1": "캐시 삭제;script;script=clear_cache"
	});
}

function logout() {
	account.logout();
}

function clear_cache() {
	controller.action("clear-cache");
}
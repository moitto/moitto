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
		"title": "캐시 삭제",
		"message": "임시로 저장됐던 파일을 삭제하시겠습니까?",
		"has-cancel-button": "yes",
		"button-1": "확인;script;script=clear_cache"
	});
}

function logout() {
	account.logout();
}

function clear_cache() {
	controller.action("clear-cache");
}

var steemjs = require("steemjs");

function Account() {}

Account.prototype.login = function(username, password, handler) {
	steemjs.get_accounts([ username ], function(response) {
		console.log(response);
		handler(response);
	});
}

Account.prototype.logout = function() {

}

Account.prototype.is_logged_in = function() {
	return false;
}

__MODULE__ = new Account();

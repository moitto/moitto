Account = (function() {
    return {
    	username : storage.value("ACTIVE_USER") || ""
    };
})();

Account.steem  = require("steem");
Account.global = require("global");
Account.users  = require("users");

Account.login = function(username, password, handler) {
	Account.steem.api.get_accounts([ username ], function(response) {
		var roles = [ "owner", "active", "posting", "memo" ];
		var keys = Account.steem.auth.generate_keys(username, password, roles);
		var owner_key = response[0]["owner"]["key_auths"][0][0];

		if (keys["owner"].pub !== owner_key) {
			handler();

			return;
		}

		Account.username = username;
		
		roles.splice(1).forEach(function(role) {
			keychain.password("KEYS_" + role.toUpperCase() + "@" + username, keys[role].priv);
		});

		storage.value("ACTIVE_USER", username);
		storage.value("USERS", (storage.value("USERS") || []).concat([ username ]));

		handler(response[0]);
	});
}

Account.logout = function() {
	(storage.value("USERS") || []).forEach(function(username) {
		var roles = [ "active", "posting", "memo" ];
	
		roles.forEach(function(role) {
			keychain.password("KEYS_" + role.toUpperCase() + "@" + username, "");
		});
	});

	Account.username = "";

	storage.value("ACTIVE_USER", "");
	storage.value("USERS", []);
}

Account.is_logged_in = function() {
	if (Account.username) {
		return true;
	}

	return false;
}

Account.switch_user = function(username) {
	if ((storage.value("USERS") || []).includes(username)) {
		Account.username = username;

		storage.value("ACTIVE_USER", username);

		return true;
	}

	return false;
}

Account.vote = function(author, permlink, weight, handler) {
	var voter = Account.username;
	var keys  = Account.__load_keys(voter, [ "posting" ]);

	Account.steem.broadcast.vote(voter, author, permlink, weight, keys).then(function(response) {
		handler(response);
	});
}

Account.unvote = function(author, permlink, handler) {
	var voter = Account.username;
	var keys  = Account.__load_keys(voter, [ "posting" ]);

	Account.steem.broadcast.vote(voter, author, permlink, 0, keys).then(function(response) {
		handler(response);
	});
}

Account.transfer = function(to, amount, memo, handler) {
	var from = Account.username;
	var keys = Account.__load_keys(from, [ "active" ]);

	Account.steem.broadcast.transfer(from, to, amount, memo, keys).then(function(response) {
		handler(response);
	});
}

Account.__load_keys = function(username, roles) {
	var keys = {};

	roles.forEach(function(role) {
		keys[role] = keychain.password("KEYS_" + role.toUpperCase() + "@" + username);
	});

	return keys;
}

__MODULE__ = Account;

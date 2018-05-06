Account = (function() {
	var username = storage.value("ACTIVE_USER") || "";
	var values   = storage.value("ACCOUNT@" + username) || {};

    return {
    	username : username,
    	values   : values
    };
})();

[ "data", "follows", "assets" ].forEach(function(property) {
	Account.__defineGetter__(property, function() {
		return Account.values[property];
	});
});

Account.steem  = require("steem");
Account.global = require("global");

Account.login = function(username, password, handler) {
	Account.steem.api.get_accounts([ username ], function(response) {
		var roles = [ "owner", "active", "posting", "memo" ];
		var keys = Account.steem.auth.generate_keys(username, password, roles);
		var owner_key = response[0]["owner"]["key_auths"][0][0];

		console.log(owner_key);

		if (keys["owner"].pub !== owner_key) {
			handler();

			return;
		}

		Account.username = username;
		Account.values["data"] = response[0];
		
		roles.splice(1).forEach(function(role) {
			keychain.password("KEYS_" + role.toUpperCase() + "@" + username, keys[role].priv);
		});

		storage.value("ACCOUNT@" + username, Account.values);
		storage.value("ACTIVE_USER", username);
		storage.value("USERS", (storage.value("USERS") || []).concat([ username ]));

		handler(Account.values["data"]);
	});
}

Account.logout = function() {
	(storage.value("USERS") || []).forEach(function(username) {
		var roles = [ "active", "posting", "memo" ];
	
		roles.forEach(function(role) {
			keychain.password("KEYS_" + role.toUpperCase() + "@" + username, "");
		});

		storage.value("ACCOUNT@" + username, {});
	});

	Account.username = "";
	Account.values   = {};

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
		Account.values = storage.value("ACCOUNT@" + username) || {};

		storage.value("ACTIVE_USER", username);

		return true;
	}

	return false;
}

Account.update_user = function(handler) {
	var username = Account.username;

	Account.steem.api.get_accounts([ username ], function(response) {
		Account.values["data"] = response[0];

		Account.steem.api.get_follow_count(username, function(response) {
			Account.values["follows"] = response;

			Account.steem.api.get_dynamic_global_properties(function(response) {
				var dynprops = Account.global.create_dynprops(response)
    		    var vesting_shares = Account.values["data"]["vesting_shares"].split(" ")[0];
    		    var steem_power = dynprops.get_steems_per_vest() * parseFloat(vesting_shares);

				Account.values["assets"] = {
					"steem_balance" : Account.values["data"]["balance"],
					"steem_power"   : steem_power.toFixed(3) + " STEEM",
					"sbd_balance"   : Account.values["data"]["sbd_balance"]
				};

				storage.value("ACCOUNT@" + username, Account.values);
				handler(Account.values["data"], Account.values["follows"], Account.values["assets"]);
			});
		})
	});
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

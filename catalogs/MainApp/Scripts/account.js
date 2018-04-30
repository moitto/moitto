var steem = require("steem");

function Account() {
	this.__props = storage.value("ACCOUNT") || {};
}

Account.prototype.login = function(username, password, handler) {
	var __props  = this.__props;

	steem.api.get_accounts([ username ], function(response) {
		var roles = [ "owner", "active", "posting", "memo" ];
		var keys = steem.auth.generate_keys(username, password, roles);
		var owner_key = response[0]["owner"]["key_auths"][0][0];

		if (keys["owner"].pub !== owner_key) {
			handler();

			return;
		}

		__props["username"] = username;
		__props["data"] = response[0];
		
		roles.splice(1).forEach(function(role) {
			keychain.password("KEYS_" + role.toUpperCase(), keys[role].priv);
		});

		storage.value("ACCOUNT", __props);
		handler(__props["data"]);
	});
}

Account.prototype.logout = function() {
	var roles = [ "active", "posting", "memo" ];
	
	roles.forEach(function(role) {
		keychain.password("KEYS_" + role.toUpperCase(), "");
	});

	this.__props = {};
	storage.value("ACCOUNT", {});
}

Account.prototype.is_logged_in = function() {
	if (this.__props["username"]) {
		return true;
	}

	return false;
}

Account.prototype.update = function(handler) {
	var username = this.__props["username"];
	var __props  = this.__props;

	steem.api.get_accounts([ username ], function(response) {
		__props["data"] = response[0];

		steem.api.get_follow_count(username, function(response) {
			__props["follows"] = response;

			steem.api.get_dynamic_global_properties(function(response) {
				var total_vesting_fund_steem = response["total_vesting_fund_steem"].split(" ")[0];
				var total_vesting_shares = response["total_vesting_shares"].split(" ")[0];
				var steems_per_vest = parseFloat(total_vesting_fund_steem) / parseFloat(total_vesting_shares);
    		    var vesting_shares = __props["data"]["vesting_shares"].split(" ")[0];
    		    var steem_power = steems_per_vest * parseFloat(vesting_shares);

				__props["assets"] = {};
				__props["assets"]["steem_balance"] = __props["data"]["balance"];
				__props["assets"]["steem_power"]   = steem_power.toFixed(3) + " STEEM";
				__props["assets"]["sbd_balance"]   = __props["data"]["sbd_balance"];

				storage.value("ACCOUNT", __props);
				handler(__props["data"], __props["follows"], __props["assets"]);
			});
		})
	});
}

Account.prototype.vote = function(author, permlink, weight, handler) {
	var voter = this.__props["username"];
	var keys  = this.__load_keys([ "posting" ]);

	steem.broadcast.vote(voter, author, permlink, weight, keys).then(function(response) {
		handler(response);
	});
}

Account.prototype.unvote = function(author, permlink, handler) {
	var voter = this.__props["username"];
	var keys  = this.__load_keys([ "posting" ]);

	steem.broadcast.vote(voter, author, permlink, 0, keys).then(function(response) {
		handler(response);
	});
}

Account.prototype.transfer = function(to, amount, memo, handler) {
	var from = this.__props["username"];
	var keys = this.__load_keys([ "active" ]);

	steem.broadcast.transfer(from, to, amount, memo, keys).then(function(response) {
		handler(response);
	});
}

Account.prototype.username = function() {
	return this.__props["username"];
}

Account.prototype.data = function() {
	return this.__props["data"];
}

Account.prototype.follows = function() {
	return this.__props["follows"];
}

Account.prototype.assets = function() {
	return this.__props["assets"];
}

Account.prototype.__load_keys = function(roles) {
	var keys = {};

	roles.forEach(function(role) {
		keys[role] = keychain.password("KEYS_" + role.toUpperCase());
	});

	return keys;
}

__MODULE__ = new Account();

Account = (function() {
    return {
        username : storage.value("ACTIVE_USER") || ""
    };
})();

Account.steem  = require("steem");
Account.global = require("global");
Account.users  = require("users");
Account.crypto = require("crypto");

Account.login = function(username, password, handler) {
    Account.steem.api.get_accounts([ username ]).then(function(response) {
        var roles = [ "owner", "active", "posting", "memo" ];
        var keys = Account.steem.auth.generate_keys(username, password, roles);
        var owner_key = response[0] ? response[0]["owner"]["key_auths"][0][0] : "";

        if (keys["owner"].pub !== owner_key) {
            handler();

            return;
        }

        Account.username = username;
        
        storage.value("ACTIVE_USER", username);
        storage.value("USERS", (storage.value("USERS") || []).concat([ username ]));

        handler(response[0], function(pin) {
            roles.splice(1).forEach(function(role) {
                var key = keys[role].priv;

                if ([ "active" ].includes(role)) {
                    //key = Account.crypto.encrypt(pin, key);
                }

                keychain.password("KEYS_" + role.toUpperCase() + "@" + username, key);
            });

            keychain.password("KEYS_OWNER.PUB" + "@" + username, owner_key);
        });
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

Account.create_user = function(username, fee, pin, handler) {
    var creator = Account.username;
    var password = Account.__generate_password();
    var roles = [ "owner", "active", "posting", "memo" ];
    var keys = Account.steem.auth.generate_keys(username, password, roles);
    var owner    = Account.__authority_for_key(keys["owner"].pub);
    var active   = Account.__authority_for_key(keys["active"].pub);
    var posting  = Account.__authority_for_key(keys["posting"].pub);
    var memo_key = keys["memo"].pub;
    var key = Account.__load_key(creator, "active", pin);

    Account.steem.broadcast.account_create(fee, creator, username, owner, active, posting, memo_key, "", [ key ]).then(function(response) {
        handler(response, password);
    }, function(reason) {
        handler();
    });
}

Account.vote = function(author, permlink, weight, handler) {
    var voter = Account.username;
    var key = Account.__load_key(voter, "posting");

    Account.steem.broadcast.vote(voter, author, permlink, weight, [ key ]).then(function(response) {
        handler(response);
    }, function(reason) {
        handler();
    });
}

Account.unvote = function(author, permlink, handler) {
    var voter = Account.username;
    var key = Account.__load_key(voter, "posting");

    Account.steem.broadcast.vote(voter, author, permlink, 0, [ key ]).then(function(response) {
        handler(response);
    }, function(reason) {
        handler();
    });
}

Account.follow_user = function(following, handler) {
    var follower = Account.username;
    var key = Account.__load_key(follower, "posting");
    var json = JSON.stringify(
        [ "follow", {
            "follower":follower,
            "following":following,
            "what":["blog"]
        }]
    );

    Account.steem.broadcast.custom_json([], [ follower ], "follow", json, [ key ]).then(function(response) {
        handler(response);
    }, function(reason) {
        handler();
    });
}

Account.unfollow_user = function(following, handler) {
    var follower = Account.username;
    var key = Account.__load_key(follower, "posting");
    var json = JSON.stringify(
        [ "follow", {
            "follower":follower,
            "following":following,
            "what":[]
        }]
    );

    Account.steem.broadcast.custom_json([], [ follower ], "follow", json, [ key ]).then(function(response) {
        handler(response);
    }, function(reason) {
        handler();
    });
}

Account.transfer = function(to, amount, memo, pin, handler) {
    var from = Account.username;
    var key = Account.__load_key(from, "active", pin);

    Account.steem.broadcast.transfer(from, to, amount, memo, [ key ]).then(function(response) {
        handler(response);
    }, function(reason) {
        handler();
    });
}

Account.verify_pubkey = function(pubkey, pin) {
    var saved_pubkey = keychain.password("KEYS_OWNER.PUB" + "@" + Account.username);

    if (saved_pubkey === pubkey) {
        //return true;
    }

    return false;
}

Account.__load_key = function(username, role, pin) {
    var key = keychain.password("KEYS_" + role.toUpperCase() + "@" + username)

    if (pin) {

    }

    return key;
}

Account.__generate_password = function() {
    return "P5" + Account.crypto.base58.encode(random(10));
}

Account.__authority_for_key = function(key) {
    return {
        "weight_threshold":1,
        "account_auths":[],
        "key_auths":[[ key, 1 ]]
    }
}

__MODULE__ = Account;

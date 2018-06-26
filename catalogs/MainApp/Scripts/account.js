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
        var owner_pubkey   = response[0] ? response[0]["owner"]["key_auths"][0][0]   : "";
        var posting_pubkey = response[0] ? response[0]["posting"]["key_auths"][0][0] : "";

        if (keys["owner"].pub !== owner_pubkey) {
            
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
                    key = Account.crypto.encrypt(pin, key);
                }

                keychain.password("KEYS_" + role.toUpperCase() + "@" + username, key);
            });

            keychain.password("OWNER_PUBKEY.ENCRYPTED" + "@" + username, JSON.parse(Account.crypto.encrypt(pin, owner_pubkey))["ct"]);
            keychain.password("OWNER_PUBKEY" + "@" + username, owner_pubkey);

            storage.value("PIN_ENABLED" + "@" + username, true);
        });
    });
}

Account.logout = function(handler) {
    (storage.value("USERS") || []).forEach(function(username) {
        var roles = [ "active", "posting", "memo" ];
    
        roles.forEach(function(role) {
            keychain.password("KEYS_" + role.toUpperCase() + "@" + username, "");
        });

        storage.value("PIN_ENABLED" + "@" + username, false);
    });

    Account.username = "";

    storage.value("ACTIVE_USER", "");
    storage.value("USERS", []);

    handler();
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

Account.reblog = function(author, permlink, handler) {
    var account = Account.username;
    var key = Account.__load_key(account, "posting");
    var json = JSON.stringify(
        [ "reblog", {
            "account":account,
            "author":author,
            "permlink":permlink
        }]
    );

    Account.steem.broadcast.custom_json([], [ account ], "follow", json, [ key ]).then(function(response) {
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

Account.is_following = function(username, handler) {
    var follower = Account.username;

    Account.global.steemjs.get_followers(username, follower, "blog", 1).then(function(response) {
        if (response.length == 0 || response[0]["follower"] !== follower) {
            handler(username, false);
        } else {
            handler(username, true);
        }
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

Account.delegate_vesting = function(delegatee, amount, pin, handler) {
    var delegator = Account.username;
    var key = Account.__load_key(delegator, "active", pin);

    Account.global.get_dynprops().then(function(dynprops) {
        var vesting_shares = (parseFloat(amount.split(" ")[0]) / dynprops.get_steems_per_vest()).toFixed(6) + " VESTS";

        Account.steem.broadcast.delegate_vesting_shares(delegator, delegatee, vesting_shares, [ key ]).then(function(response) {
            handler(response);
        }, function(reason) {
            handler();
        });
    }, function(reason) {
        handler();
    });
}

Account.claim_rewards = function(handler) {
    var account = Account.username;
    var key = Account.__load_key(account, "posting");

    Account.steem.api.get_accounts([ account ]).then(function(response) {
        var reward_steem_balance   = "0.000 STEEM";//response[0]["reward_steem_balance"];
        var reward_sbd_balance     = response[0]["reward_sbd_balance"];
        var reward_vesting_balance = response[0]["reward_vesting_balance"];

        Account.steem.broadcast.claim_reward_balance(account, reward_steem_balance, reward_sbd_balance, reward_vesting_balance, [ key ]).then(function(response) {
            handler(response);
        }, function(reason) {
            handler();
        });
    }, function(reason) {
        handler();
    });
}

Account.register_active_key = function(password, handler) {
    var username = Account.username;

    Account.steem.api.get_accounts([ username ]).then(function(response) {
        var roles = [ "owner", "active" ];
        var keys = Account.steem.auth.generate_keys(username, password, roles);
        var owner_pubkey = response[0] ? response[0]["owner"]["key_auths"][0][0]   : "";

        if (keys["owner"].pub !== owner_pubkey) {
            
            handler();

            return;
        }

        handler(response[0], function(pin) {
            roles.splice(1).forEach(function(role) {
                var key = keys[role].priv;

                if ([ "active" ].includes(role)) {
                    key = Account.crypto.encrypt(pin, key);
                }

                keychain.password("KEYS_" + role.toUpperCase() + "@" + username, key);
            });

            keychain.password("OWNER_PUBKEY.ENCRYPTED" + "@" + username, JSON.parse(Account.crypto.encrypt(pin, owner_pubkey))["ct"]);
            keychain.password("OWNER_PUBKEY" + "@" + username, owner_pubkey);

            storage.value("PIN_ENABLED" + "@" + username, true);
        });
    });
}

Account.verify_pin = function(pin) {
    var owner_pubkey = keychain.password("OWNER_PUBKEY" + "@" + Account.username);
    var encrypted_owner_pubkey = keychain.password("OWNER_PUBKEY.ENCRYPTED" + "@" + Account.username);

    if (JSON.parse(Account.crypto.encrypt(pin, owner_pubkey))["ct"] === encrypted_owner_pubkey) {
        return true;
    }

    return false;
}

Account.__load_key = function(username, role, pin) {
    var key = keychain.password("KEYS_" + role.toUpperCase() + "@" + username);

    if (pin) {
        key = Account.crypto.decrypt(pin, key);
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

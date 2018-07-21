Account = (function() {
    return {}
})();

Account.steem  = require("steem");
Account.global = require("global");
Account.users  = require("users");
Account.crypto = require("crypto");

Account.login = function(username, password, handler) {
    Account.steem.api.get_accounts([ username ]).then(function(response) {
        var roles = [ "owner", "active", "posting", "memo" ];
        var keys = Account.steem.auth.generate_keys(username, password, roles);
        var needs_pin = true;

        if (!Account.__is_private_key_for_role(keys["owner"].priv, "owner", response[0])) {
            if (!Account.__is_private_key_for_role(password, "posting", response[0])) {
                handler();

                return;
            }

            keys = { "posting":{ "priv":password } }
            needs_pin = false;
        }
        
        storage.value("ACTIVE_USER", username);
        storage.value("USERS", (storage.value("USERS") || []).concat([ username ]));

        [ "posting", "memo" ].forEach(function(role) {
            if (keys.hasOwnProperty(role)) {
                keychain.password("KEYS_" + role.toUpperCase() + "@" + username, keys[role].priv);
            }
        });

        handler(keys, needs_pin, function(pin) {
            var owner_pubkey = response[0]["owner"]["key_auths"][0][0];

            [ "active" ].forEach(function(role) {
                if (keys.hasOwnProperty(role)) {
                    keychain.password("KEYS_" + role.toUpperCase() + "@" + username, Account.crypto.encrypt(pin, keys[role].priv));
                }
            });

            keychain.password("OWNER_PUBKEY.ENCRYPTED" + "@" + username, JSON.parse(Account.crypto.encrypt(pin, owner_pubkey))["ct"]);
            keychain.password("OWNER_PUBKEY" + "@" + username, owner_pubkey);

            storage.value("ACTIVE_KEY_ENABLED" + "@" + username, true);
        });
    });
}

Account.logout = function(handler) {
    (storage.value("USERS") || []).forEach(function(username) {
        var roles = [ "active", "posting", "memo" ];
    
        roles.forEach(function(role) {
            keychain.password("KEYS_" + role.toUpperCase() + "@" + username, "");
        });

        storage.value("ACTIVE_KEY_ENABLED" + "@" + username, false);
    });

    storage.value("ACTIVE_USER", "");
    storage.value("USERS", []);

    handler();
}

Account.is_logged_in = function() {
    if (storage.value("ACTIVE_USER")) {
        return true;
    }

    return false;
}

Account.get_username = function() {
    return storage.value("ACTIVE_USER") || "";
}

Account.active_key_enabled = function() {
    var username = storage.value("ACTIVE_USER") || ""

    if (username) {
        return storage.value("ACTIVE_KEY_ENABLED" + "@" + username) || false;
    }

    return false;
}

Account.switch_user = function(username) {
    if ((storage.value("USERS") || []).includes(username)) {
        storage.value("ACTIVE_USER", username);

        return true;
    }

    return false;
}

Account.create_user = function(username, fee, pin, handler) {
    var creator = storage.value("ACTIVE_USER") || "";
    var password = Account.__generate_password();
    var roles = [ "owner", "active", "posting", "memo" ];
    var keys = Account.steem.auth.generate_keys(username, password, roles);
    var owner    = Account.__authority_for_key(keys["owner"].pub);
    var active   = Account.__authority_for_key(keys["active"].pub);
    var posting  = Account.__authority_for_key(keys["posting"].pub);
    var memo_key = keys["memo"].pub;
    var key = Account.__load_key(creator, "active", pin);

    console.log("password: " + password);

    Account.steem.broadcast.account_create(fee, creator, username, owner, active, posting, memo_key, "", [ key ]).then(function(response) {
        handler(response, password);
    }, function(reason) {
        handler();
    });
}

Account.vote = function(author, permlink, weight, handler) {
    var voter = storage.value("ACTIVE_USER") || "";
    var key = Account.__load_key(voter, "posting");

    Account.steem.broadcast.vote(voter, author, permlink, weight, [ key ]).then(function(response) {
        handler(response);
    }, function(reason) {
        handler();
    });
}

Account.unvote = function(author, permlink, handler) {
    var voter = storage.value("ACTIVE_USER") || "";
    var key = Account.__load_key(voter, "posting");

    Account.steem.broadcast.vote(voter, author, permlink, 0, [ key ]).then(function(response) {
        handler(response);
    }, function(reason) {
        handler();
    });
}

Account.reblog = function(author, permlink, handler) {
    var account = storage.value("ACTIVE_USER") || "";
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
    var follower = storage.value("ACTIVE_USER") || "";
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
    var follower = storage.value("ACTIVE_USER") || "";
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
    var follower = storage.value("ACTIVE_USER") || "";

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
    var from = storage.value("ACTIVE_USER") || "";
    var key = Account.__load_key(from, "active", pin);

    Account.steem.broadcast.transfer(from, to, amount, memo, [ key ]).then(function(response) {
        handler(response);
    }, function(reason) {
        handler();
    });
}

Account.delegate_vesting = function(delegatee, amount, pin, handler) {
    var delegator = storage.value("ACTIVE_USER") || "";
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

Account.transfer_to_vesting = function(to, amount, pin, handler) {
    var from = storage.value("ACTIVE_USER") || "";
    var key = Account.__load_key(from, "active", pin);

    Account.steem.broadcast.transfer_to_vesting(from, to, amount, [ key ]).then(function(response) {
        handler(response);
    }, function(reason) {
        handler();
    });
}

Account.withdraw_vesting = function(amount, pin, handler) {
    var account = storage.value("ACTIVE_USER") || "";
    var key = Account.__load_key(account, "active", pin);

    Account.global.get_dynprops().then(function(dynprops) {
        var vesting_shares = (parseFloat(amount.split(" ")[0]) / dynprops.get_steems_per_vest()).toFixed(6) + " VESTS";

        Account.steem.broadcast.withdraw_vesting(account, vesting_shares, [ key ]).then(function(response) {
            handler(response);
        }, function(reason) {
            handler();
        });
    }, function(reason) {
        handler();
    });
}

Account.claim_rewards = function(handler) {
    var account = storage.value("ACTIVE_USER") || "";
    var key = Account.__load_key(account, "posting");

    Account.steem.api.get_accounts([ account ]).then(function(response) {
        var reward_steem_balance   = response[0]["reward_steem_balance"];
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

Account.comment = function(parent_author, parent_permlink, title, body, json_metadata) {
    var author = storage.value("ACTIVE_USER") || "";
    var key = Account.__load_key(author, "posting");
    var permlink = "";

    Account.steem.broadcast.comment(parent_author, parent_permlink, author, permlink, title, body, json_metadata, [ key ]).then(function(response) {
        handler(response);
    }, function(reason) {
        handler();
    });
}

Account.enable_active_key = function(password, handler) {
    var username = storage.value("ACTIVE_USER") || "";

    Account.steem.api.get_accounts([ username ]).then(function(response) {
        var roles = [ "owner", "active", "posting", "memo" ];
        var keys = Account.steem.auth.generate_keys(username, password, roles);

        if (!Account.__is_private_key_for_role(keys["owner"].priv, "owner", response[0])) {
            if (!Account.__is_private_key_for_role(password, "active", response[0])) {
                handler();

                return;
            }

            keys = { "active":{ "priv":password } }
        }

        [ "posting", "memo" ].forEach(function(role) {
            if (keys.hasOwnProperty(role)) {
                keychain.password("KEYS_" + role.toUpperCase() + "@" + username, keys[role].priv);
            }
        });

        handler(keys, function(pin) {
            var owner_pubkey = response[0]["owner"]["key_auths"][0][0];

            [ "active" ].forEach(function(role) {
                if (keys.hasOwnProperty(role)) {
                    keychain.password("KEYS_" + role.toUpperCase() + "@" + username, Account.crypto.encrypt(pin, keys[role].priv));
                }
            });

            keychain.password("OWNER_PUBKEY.ENCRYPTED" + "@" + username, JSON.parse(Account.crypto.encrypt(pin, owner_pubkey))["ct"]);
            keychain.password("OWNER_PUBKEY" + "@" + username, owner_pubkey);

            storage.value("ACTIVE_KEY_ENABLED" + "@" + username, true);
        });
    });
}

Account.active_key_enabled = function() {
    var username = storage.value("ACTIVE_USER") || "";

    if (storage.value("ACTIVE_KEY_ENABLED" + "@" + username)) {
        return true;
    }

    return false;
}

Account.verify_pin = function(pin) {
    var username = storage.value("ACTIVE_USER") || "";
    var owner_pubkey = keychain.password("OWNER_PUBKEY" + "@" + username);
    var encrypted_owner_pubkey = keychain.password("OWNER_PUBKEY.ENCRYPTED" + "@" + username);

    if (JSON.parse(Account.crypto.encrypt(pin, owner_pubkey))["ct"] === encrypted_owner_pubkey) {
        return true;
    }

    return false;
}

Account.__is_private_key_for_role = function(key, role, data) {
    try {
        var public_key = Account.steem.auth.generate_public_key(key);

        for (var i = 0; i < data[role]["key_auths"].length; i++) {
            if (public_key === data[role]["key_auths"][i][0]) {
                return true;
            }
        }
    } catch(e) {
        console.log(e);
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

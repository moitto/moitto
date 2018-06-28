SteemBroadcast = (function() {
    return {};
})();

SteemBroadcast.operations = include("./operations.js");
SteemBroadcast.serializer = include("./serializer.js")

SteemBroadcast.vote = function(voter, author, permlink, weight, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "vote", { 
            voter:voter, author:author, permlink:permlink, weight:weight
        }];
        console.log("VOTE: " + JSON.stringify(operation));

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.transfer = function(from, to, amount, memo, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "transfer", { 
            from:from, to:to, amount:amount, memo:memo
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.account_create = function(fee, creator, new_account_name, owner, active, posting, memo_key, json_metadata, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "account_create", { 
            fee:fee, creator:creator, new_account_name:new_account_name, 
            owner:owner, active:active, posting:posting, memo_key:memo_key, 
            json_metadata:json_metadata
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.custom_json = function(required_auths, required_posting_auths, id, json, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "custom_json", { 
            required_auths:required_auths, required_posting_auths:required_posting_auths, id:id, json:json
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.claim_reward_balance = function(account, reward_steem, reward_sbd, reward_vests, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "claim_reward_balance", { 
            account:account, reward_steem:reward_steem, reward_sbd:reward_sbd, reward_vests:reward_vests
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.delegate_vesting_shares = function(delegator, delegatee, vesting_shares, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "delegate_vesting_shares", { 
            delegator:delegator, delegatee:delegatee, vesting_shares:vesting_shares
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.transfer_to_vesting = function(from, to, amount, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "transfer_to_vesting", { 
            from:from, to:to, amount:amount
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.withraw_vesting = function(account, amount, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "withdraw_vesting", { 
            account:account, amount:amount
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.__send_transaction = function(operation, keys) {
    return new Promise(function(resolve, reject) {
        var transaction = {};

        transaction["operations"] = [ operation ];
        transaction["extensions"] = [];

        SteemBroadcast.__prepare_transaction(transaction).then(function(transaction) {
            SteemBroadcast.__sign_transaction(transaction, keys, function(signatures) {
                transaction["signatures"] = signatures;

               Steem.api.broadcast_transaction_synchronous(transaction).then(function(response) {
                    resolve(response);
                }, function(reason) {
                    reject(reason);
                });
            });
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.__prepare_transaction = function(transaction) {
    return new Promise(function(resolve, reject) {
        Steem.api.get_dynamic_global_properties().then(function(properties) {
            var ref_block_num = (properties.last_irreversible_block_num - 1) & 0xFFFF;
            var current_date = new Date(properties.time + 'Z');
            var expired_date = new Date(current_date.getTime() + 600 * 1000);
            var expiration = expired_date.toISOString().substring(0, 19);

            Steem.api.get_block(properties.last_irreversible_block_num).then(function(block) {
                var head_block_id = decode("hex", block.previous);
                var ref_block_prefix = Steem.struct.unpack("<I", head_block_id, 4)[0];

                transaction["ref_block_num"]    = ref_block_num;
                transaction["ref_block_prefix"] = ref_block_prefix;
                transaction["expiration"]       = expiration;

                resolve(transaction);
            }, function(reason) {
                reject(reason);
            });
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.__sign_transaction = function(transaction, keys, handler) {
    var buffer = SteemBroadcast.serializer.serialize_transaction(transaction);
    var signatures = SteemAuth.sign_transaction(buffer, keys);

    handler(signatures);
}

__MODULE__ = SteemBroadcast;

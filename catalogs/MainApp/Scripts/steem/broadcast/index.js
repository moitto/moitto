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

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.comment = function(parent_author, parent_permlink, author, permlink, title, body, json_metadata, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "comment", { 
            parent_author:parent_author, parent_permlink:parent_permlink,
            author:author, permlink:permlink, title:title, body:body, json_metadata:json_metadata
        }];

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

SteemBroadcast.withdraw_vesting = function(account, vesting_shares, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "withdraw_vesting", { 
            account:account, vesting_shares:vesting_shares
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

SteemBroadcast.account_witness_vote = function(account, witness, approve, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "account_witness_vote", { 
            account:account, witness:witness, approve:approve
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.account_witness_proxy = function(account, proxy, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "account_witness_proxy", { 
            account:account, proxy:proxy
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.delete_comment = function(author, permlink, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "delete_comment", { 
            author:author, permlink:permlink
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

SteemBroadcast.comment_options = function(author, permlink, max_accepted_payout, percent_steem_dollars, allow_votes, allow_curation_rewards, extensions, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "comment_options", { 
            author:author, permlink:permlink, max_accepted_payout:max_accepted_payout, 
            percent_steem_dollars:percent_steem_dollars, allow_votes:allow_votes, 
            allow_curation_rewards:allow_curation_rewards, extensions:extensions
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

SteemBroadcast.escrow_transfer = function(from, to, agent, escrow_id, sbd_amount, steem_amount, fee, ratification_deadline, escrow_expiration, json_meta, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "escrow_transfer", { 
            from:from, to:to, agent:agent, escrow_id:escrow_id, sbd_amount:sbd_amount, steem_amount:steem_amount, fee:fee,
            ratification_deadline:ratification_deadline, escrow_expiration:escrow_expiration, json_meta:json_meta
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.escrow_dispute = function(from, to, agent, who, escrow_id, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "escrow_dispute", { 
            from:from, to:to, agent:agent, who:who, escrow_id:escrow_id
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.escrow_release = function(from, to, agent, who, receiver, escrow_id, sbd_amount, steem_amount, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "escrow_release", { 
            from:from, to:to, agent:agent, who:who, receiver:receiver, escrow_id:escrow_id,
            sbd_amount:sbd_amount, steem_amount:steem_amount
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(response) {
            resolve(response);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemBroadcast.escrow_approve = function(from, to, agent, who, escrow_id, approve, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "escrow_approve", { 
            from:from, to:to, agent:agent, who:who, escrow_id:escrow_id, approve:approve
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

SteemBroadcast.__send_transaction = function(operation, keys) {
    return new Promise(function(resolve, reject) {
        var transaction = {};

        transaction["operations"] = [ operation ];
        transaction["extensions"] = [];

        SteemBroadcast.__prepare_transaction(transaction).then(function(transaction) {
            SteemBroadcast.__sign_transaction(transaction, keys).then(function(signatures) {
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

SteemBroadcast.__sign_transaction = function(transaction, keys) {
    return new Promise(function(resolve, reject) {
        var message = SteemBroadcast.serializer.serialize_transaction(transaction);
        var signatures = SteemAuth.sign_transaction(message, keys);

        resolve(signatures);
    });
}

__MODULE__ = SteemBroadcast;

SteemBroadcast = {};

SteemBroadcast.serializer = include("./serializer.js");

SteemBroadcast.vote = function(voter, author, permlink, weight, keys) {
    return new Promise(function(resolve, reject) {
        var operation = [ "vote" , { 
            voter:voter, author:author, permlink:permlink, weight: weight
        }];

        SteemBroadcast.__send_transaction(operation, keys).then(function(transaction) {
            SteemApi.broadcast_transaction_synchronous(transaction, function(response) {
                resolve(response);
            });
        });
    });
}

SteemBroadcast.__send_transaction = function(operation, keys) {
    return new Promise(function(resolve, reject) {
        var transaction = {};

        transaction["operations"] = [ operation ];
        transaction["extensions"] = [];

        SteemBroadcast.__prepare_transaction(transaction).then(function(transaction) {
            SteemBroadcast.__sign_transaction(transaction, keys);

            resolve(transaction);
        });
    });
}

SteemBroadcast.__prepare_transaction = function(transaction) {
    return new Promise(function(resolve, reject) {
        SteemApi.get_dynamic_global_properties(function(properties) {
            var ref_block_num = (properties.last_irreversible_block_num - 1) & 0xFFFF;
            var current_date = new Date(properties.time + 'Z');
            var expired_date = new Date(current_date.getTime() + 600 * 1000);
            var expiration = expired_date.toISOString().substring(0, 19);

            SteemApi.get_block(properties.last_irreversible_block_num, function(block) {
                var head_block_id = decode("hex", block.previous);
                var ref_block_prefix = Steem.struct.unpack("<I", head_block_id, 4)[0];

                transaction["ref_block_num"]    = ref_block_num;
                transaction["ref_block_prefix"] = ref_block_prefix;
                transaction["expiration"]       = expiration;

                resolve(transaction);
            });
        });
    });
}

SteemBroadcast.__sign_transaction = function(transaction, keys) {
    var buffer = SteemBroadcast.serializer.serialize_transaction(transaction);
    var signatures = SteemAuth.sign_transaction(buffer, keys);

    transaction["signatures"] = signatures;
}

__MODULE__ = SteemBroadcast;

SteemBroadcast = {};

SteemBroadcast.operations = include("./operations.js");

SteemBroadcast.vote = function(voter, author, permlink, weight, priv_keys) {
    return new Promise(function(resolve, reject) {
        var operation = SteemBroadcast.__find_operation("vote");
        var params = { voter:voter, author:author, permlink:permlink, weight: weight };
        
        SteemBroadcast.__send_transaction(operation, params, priv_keys).then(function(transaction) {
            console.log("@@@@@@@@@@@@");
            SteemBroadcast.operations.forEach(function(op) {
                    console.log(op.operation);
            });
                                                                        
            resolve(transaction);
        });
    })
}

SteemBroadcast.__send_transaction = function(operation, params, priv_keys) {
    return new Promise(function(resolve, reject) {
        var transaction = {};
                       
        SteemBroadcast.__prepare_transaction(transaction).then(function(transaction) {
            SteemBroadcast.__sign_transaction(transaction);

            resolve(transaction);
        });
    });
}

SteemBroadcast.__prepare_transaction = function(transaction) {
    return new Promise(function(resolve, reject) {
        resolve(transaction);
    });
}

SteemBroadcast.__sign_transaction = function(transaction) {
}

SteemBroadcast.__find_operation = function(name) {
    for (operation in SteemBroadcast.operations) {
        if (operation.operation == name) {
            return operation;
        }
    }
}

module = SteemBroadcast;

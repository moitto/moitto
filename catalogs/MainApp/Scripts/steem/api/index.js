SteemApi = (function() {
    return {
        _tx_number:1
    };
})();

SteemApi.get_dynamic_global_properties = function() {
    return new Promise(function(resolve, reject) {
        var method = "get_dynamic_global_properties";
        var params = [];

        SteemApi.__request_rpc(method, params).then(function(response) {
            if (!response["result"]) {
                reject(response["error"]);

                return;
            }

            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemApi.get_block = function(block) {
    return new Promise(function(resolve, reject) {
        var method = "get_block";
        var params = [ block ];

        SteemApi.__request_rpc(method, params).then(function(response) {
            if (!response["result"]) {
                reject(response["error"]);

                return;
            }

            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemApi.get_accounts = function(names) {
    return new Promise(function(resolve, reject) {
        var method = "get_accounts";
        var params = [ names ];

        SteemApi.__request_rpc(method, params).then(function(response) {
            if (!response["result"]) {
                reject(response["error"]);

                return;
            }

            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemApi.get_follow_count = function(account) {
    return new Promise(function(resolve, reject) {
        var method = "call";
        var params = [ "follow_api", "get_follow_count", [ account ] ];

        SteemApi.__request_rpc(method, params).then(function(response) {
            if (!response["result"]) {
                reject(response["error"]);

                return;
            }

            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemApi.broadcast_transaction_synchronous = function(transaction) {
    return new Promise(function(resolve, reject) {
        var method = "broadcast_transaction_synchronous";
        var params = [ transaction ];

        SteemApi.__request_rpc(method, params).then(function(response) {
            console.log(JSON.stringify(response));
            if (!response["result"]) {
                reject(response["error"]);

                return;
            }
            
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemApi.__request_rpc = function(method, params) {
    return new Promise(function(resolve, reject) {
        var request = SteemApi.__build_request(method, params);
        var url = "https://api.steemit.com";
        var headers = SteemApi.__rpc_headers();

        fetch(url, {
            method:"POST", header:headers, body:JSON.stringify(request)
        }).then(function(response) {
            response.json().then(function(json) {
                resolve(json);
            }, function(reason) {
                reject(reason);
            });
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemApi.__build_request = function(method, params) {
    var request = {};

    request["jsonrpc"] = "2.0";
    request["method"]  = method;
    request["params"]  = params;
    request["id"]      = SteemApi._tx_number;

    SteemApi._tx_number += 1;

    return request;
}

SteemApi.__rpc_headers = function() {
    var headers = {};

    headers["Content-Type"] = "application/json-rpc";

    return headers;
}

__MODULE__ = SteemApi;

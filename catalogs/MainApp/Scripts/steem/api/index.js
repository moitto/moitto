SteemApi = (function() {
    return {
        _tx_number:1
    };
})();

SteemApi.get_dynamic_global_properties = function(handler) {
    var method = "get_dynamic_global_properties";
    var params = [];

    SteemApi.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemApi.get_block = function(block, handler) {
    var method = "get_block";
    var params = [ block ];

    SteemApi.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemApi.get_accounts = function(names, handler) {
    var method = "get_accounts";
    var params = [ names ];

    SteemApi.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemApi.get_follow_count = function(name, handler) {
    var method = "call";
    var params = [ "follow_api", "get_follow_count", [ name ] ];

    SteemApi.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemApi.broadcast_transaction_synchronous = function(transaction, handler) {
    var method = "broadcast_transaction_synchronous";
    var params = [ transaction ];

    SteemApi.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemApi.__request_rpc = function(method, params, handler) {
    var request = SteemApi.__build_request(method, params);
    var url = "https://api.steemit.com";
    var headers = SteemApi.__rpc_headers();

    fetch(url, {
        method:"POST", header:headers, body:JSON.stringify(request)
    }).then(function(response) {
        response.json().then(function(json) {
            handler(json);
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

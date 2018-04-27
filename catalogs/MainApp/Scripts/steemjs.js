function SteemJS() {
    this._tx_number = 1;
}

SteemJS.prototype.get_discussions_by_created = function(tag, limit, start_author, start_permlink, handler) {
    var method = "get_discussions_by_created";
    var params = [ this.__query_for_discussions(tag, limit, start_author, start_permlink) ];

    this.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.prototype.get_discussions_by_trending = function(tag, limit, start_author, start_permlink, handler) {
    var method = "get_discussions_by_trending";
    var params = [ this.__query_for_discussions(tag, limit, start_author, start_permlink) ];

    this.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.prototype.get_discussions_by_hot = function(tag, limit, start_author, start_permlink, handler) {
    var method = "get_discussions_by_hot";
    var params = [ this.__query_for_discussions(tag, limit, start_author, start_permlink) ];

    this.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.prototype.get_discussions_by_feed = function(tag, limit, start_author, start_permlink, handler) {
    var method = "get_discussions_by_feed";
    var params = [ this.__query_for_discussions(tag, limit, start_author, start_permlink) ];

    this.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.prototype.get_content = function(author, permlink, handler) {
    var method = "get_content";
    var params = [ author, permlink ];

    this.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.prototype.get_accounts = function(names, handler) {
    var method = "get_accounts";
    var params = [ this.__query_for_accounts(names) ];

    this.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.prototype.__query_for_discussions = function(tag, limit, start_author, start_permlink) {
    var params = {};

    params["tag"]   = tag;
    params["limit"] = limit.toString();

    if (start_author && start_permlink) {
        params["start_author"]   = start_author;
        params["start_permlink"] = start_permlink;
    }

    return params;
}

SteemJS.prototype.__query_for_accounts = function(names) {
    var params = {};

    params["names[]"] = [];

    names.forEach(function(name) {
        params["names[]"].push(name);
    });

    return params;
}

SteemJS.prototype.__request_rpc = function(method, params, handler) {
    var request = this.__build_request(method, params);
    var url = "https://api.steemit.com";
    var headers = this.__rpc_headers();

    fetch(url, {
        method:"POST", header:headers, body:JSON.stringify(request)
    }).then(function(response) {
        response.json().then(function(json) {
            handler(json);
        });
    });
}

SteemJS.prototype.__build_request = function(method, params) {
    var request = {};

    request["jsonrpc"] = "2.0";
    request["method"]  = method;
    request["params"]  = params;
    request["id"]      = this._tx_number;

    this._tx_number += 1;

    return request;
}

SteemJS.prototype.__rpc_headers = function() {
    var headers = {};

    headers["Content-Type"] = "application/json-rpc";

    return headers;
}

__MODULE__ = new SteemJS();

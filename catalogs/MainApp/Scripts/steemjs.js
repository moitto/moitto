SteemJS = (function() {
    return {
        _tx_number:1
    };
})();

SteemJS.get_dynamic_global_properties = function(handler) {
    var method = "get_dynamic_global_properties";
    var params = [];

    SteemJS.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.get_discussions_by_created = function(tag, limit, start_author, start_permlink, handler) {
    var method = "get_discussions_by_created";
    var params = [ SteemJS.__query_for_discussions(tag, limit, start_author, start_permlink) ];

    SteemJS.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.get_discussions_by_trending = function(tag, limit, start_author, start_permlink, handler) {
    var method = "get_discussions_by_trending";
    var params = [ SteemJS.__query_for_discussions(tag, limit, start_author, start_permlink) ];

    SteemJS.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.get_discussions_by_hot = function(tag, limit, start_author, start_permlink, handler) {
    var method = "get_discussions_by_hot";
    var params = [ SteemJS.__query_for_discussions(tag, limit, start_author, start_permlink) ];

    SteemJS.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.get_discussions_by_feed = function(tag, limit, start_author, start_permlink, handler) {
    var method = "get_discussions_by_feed";
    var params = [ SteemJS.__query_for_discussions(tag, limit, start_author, start_permlink) ];

    SteemJS.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.get_content = function(author, permlink, handler) {
    var method = "get_content";
    var params = [ author, permlink ];

    SteemJS.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.get_accounts = function(names, handler) {
    var method = "get_accounts";
    var params = [ names ];

    SteemJS.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.get_follow_count = function(name, handler) {
    var method = "call";
    var params = [ "follow_api", "get_follow_count", [ name ] ];

    SteemJS.__request_rpc(method, params, function(response) {
        handler(response["result"]);
    });
}

SteemJS.__query_for_discussions = function(tag, limit, start_author, start_permlink) {
    var params = {};

    params["tag"]   = tag;
    params["limit"] = limit.toString();

    if (start_author && start_permlink) {
        params["start_author"]   = start_author;
        params["start_permlink"] = start_permlink;
    }

    return params;
}

SteemJS.__request_rpc = function(method, params, handler) {
    var request = SteemJS.__build_request(method, params);
    var url = "https://api.steemit.com";
    var headers = SteemJS.__rpc_headers();

    fetch(url, {
        method:"POST", header:headers, body:JSON.stringify(request)
    }).then(function(response) {
        response.json().then(function(json) {
            handler(json);
        });
    });
}

SteemJS.__build_request = function(method, params) {
    var request = {};

    request["jsonrpc"] = "2.0";
    request["method"]  = method;
    request["params"]  = params;
    request["id"]      = SteemJS._tx_number;

    SteemJS._tx_number += 1;

    return request;
}

SteemJS.__rpc_headers = function() {
    var headers = {};

    headers["Content-Type"] = "application/json-rpc";

    return headers;
}

SteemJS.version = function() {
    return "1.0";
}

__MODULE__ = SteemJS;

SteemJS = (function() {
    return {
        _tx_number:1
    };
})();

SteemJS.get_dynamic_global_properties = function() {
    return new Promise(function(resolve, reject) {
        var method = "get_dynamic_global_properties";
        var params = [];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_discussions_by_created = function(tag, start_author, start_permlink, limit) {
    return new Promise(function(resolve, reject) {
        var method = "get_discussions_by_created";
        var params = [ { tag:tag, start_author:start_author, start_permlink:start_permlink, limit:limit } ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_discussions_by_trending = function(tag, start_author, start_permlink, limit) {
    return new Promise(function(resolve, reject) {
        var method = "get_discussions_by_trending";
        var params = [ { tag:tag, start_author:start_author, start_permlink:start_permlink, limit:limit } ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_discussions_by_hot = function(tag, start_author, start_permlink, limit) {
    return new Promise(function(resolve, reject) {
        var method = "get_discussions_by_hot";
        var params = [ { tag:tag, start_author:start_author, start_permlink:start_permlink, limit:limit } ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_discussions_by_feed = function(tag, start_author, start_permlink, limit) {
    return new Promise(function(resolve, reject) {
        var method = "get_discussions_by_feed";
        var params = [ { tag:tag, start_author:start_author, start_permlink:start_permlink, limit:limit } ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_discussions_by_blog = function(tag, start_author, start_permlink, limit) {
    return new Promise(function(resolve, reject) {
        var method = "get_discussions_by_blog";
        var params = [ { tag:tag, start_author:start_author, start_permlink:start_permlink, limit:limit } ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_discussions_by_comments = function(tag, start_author, start_permlink, limit) {
    return new Promise(function(resolve, reject) {
        var method = "get_discussions_by_comments";
        var params = [ { tag:tag, start_author:start_author, start_permlink:start_permlink, limit:limit } ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_discussions_by_author_before_date = function(author, start_permlink, before_date, limit) {
    return new Promise(function(resolve, reject) {
        var method = "get_discussions_by_author_before_date";
        var params = [ author, start_permlink, before_date.toISOString().substring(0, 19), limit ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_replies_by_last_update = function(author, start_permlink, limit) {
    return new Promise(function(resolve, reject) {
        var method = "get_replies_by_last_update";
        var params = [ author, start_permlink, limit ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_content = function(author, permlink) {
    return new Promise(function(resolve, reject) {
        var method = "get_content";
        var params = [ author, permlink ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_content_replies = function(author, permlink) {
    return new Promise(function(resolve, reject) {
        var method = "get_content_replies";
        var params = [ author, permlink ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_active_votes = function(author, permlink) {
    return new Promise(function(resolve, reject) {
        var method = "get_active_votes";
        var params = [ author, permlink ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_accounts = function(names) {
    return new Promise(function(resolve, reject) {
        var method = "get_accounts";
        var params = [ names ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_account_history = function(account, from, limit) {
    return new Promise(function(resolve, reject) {
        var method = "get_account_history";
        var params = [ account, from, limit ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_followers = function(following, start_follower, follow_type, limit) {
    return new Promise(function(resolve, reject) {
        var method = "call";
        var params = [ "follow_api", "get_followers", [ following, start_follower, follow_type, limit ] ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_following = function(follower, start_following, follow_type, limit) {
    return new Promise(function(resolve, reject) {
        var method = "call";
        var params = [ "follow_api", "get_following", [ follower, start_following, follow_type, limit ] ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_follow_count = function(account) {
    return new Promise(function(resolve, reject) {
        var method = "call";
        var params = [ "follow_api", "get_follow_count", [ account ] ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.get_state = function(path) {
    return new Promise(function(resolve, reject) {
        var method = "call";
        var params = [ "database_api", "get_state", [ path ] ];

        SteemJS.__request_rpc(method, params).then(function(response) {
            resolve(response["result"]);
        }, function(reason) {
            reject(reason);
        });
    });
}

SteemJS.__request_rpc = function(method, params, handler) {
    return new Promise(function(resolve, reject) {
        var request = SteemJS.__build_request(method, params);
        var url = "https://api.steemit.com";
        var headers = SteemJS.__rpc_headers();

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

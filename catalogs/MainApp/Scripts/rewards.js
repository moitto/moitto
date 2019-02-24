Rewards = (function() {
    return {};
})();

Rewards.get_reward_reply = function(post_author, post_permlink, type, create_if_not_exist, handler) {
    var url = "https://moitto.io/api/rewards/" + post_author + "/" + post_permlink;
    var query = Rewards.__to_query_string({ "type":type });
    var method = create_if_not_exist ? "POST" : "GET";

    fetch(url + "?" + query, { 
        "method":method 
    }).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                handler(data["author"], data["permlink"]);
            });
        } else {
             handler();
        }
    }, function(reason) {
        hanlder();
    });
}

Rewards.__to_query_string = function(params) {
    return Object.keys(params).map(function(k) {
        return k + "=" + encodeURIComponent(params[k]);
    }).join('&')
}

__MODULE__ = Rewards;

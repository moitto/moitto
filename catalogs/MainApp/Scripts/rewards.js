Rewards = (function() {
    return {};
})();

Rewards.get_reward_reply = function(post_author, post_permlink, type, create_if_not_exist, handler) {
    console.log("get_reward_reply: " + post_author + "-" + post_permlink);
    var url = "https://moitto.io/api/rewards/" + post_author + "/" + post_permlink;
    var query = Rewards.__to_query_string({ "type":type });
    var method = create_if_not_exist ? "POST" : "GET";

    fetch(url + "?" + query, { 
        "method":method 
    }).then(function(response) {
        if (response.ok) {
            response.json().then(function(json) {
                handler(json);
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

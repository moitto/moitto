AskSteem = (function() {
    return {};
})();

AskSteem.search = function(keyword, page, options, handler) {
    var url = "https://api.asksteem.com/search";
    var query = AskSteem.__query_for_searching(keyword, page, options);

    fetch(url + "?" + query).then(function(response){
        if (response.ok) {
            response.json().then(function(data) {
                handler(data);
            });
        }
    }, function(reason) {
        hanlder();
    });
}

AskSteem.__query_for_searching = function(keyword, page, options) {
    var params = {};
 
    params["q"]  = keyword;

    if (page > 1) {
        params["pg"] = page;
    }

    return AskSteem.__to_query_string(params);
}

AskSteem.__to_query_string = function(params) {
    return Object.keys(params).map(function(k) {
        return k + "=" + encodeURIComponent(params[k]);
    }).join('&')
}

AskSteem.version = function() {
    return "1.0";
}

__MODULE__ = AskSteem;

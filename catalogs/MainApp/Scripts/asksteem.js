function AskSteem() {}

AskSteem.prototype.search = function(keyword, page, options, handler) {
    var url = "https://api.asksteem.com/search";
    var query = this.__query_for_searching(keyword, page, options);

    fetch(url + "?" + query).then(function(response){
        if (response.ok) {
            response.json().then(function(json) {
                handler(json);
            });
        }
    });
}

AskSteem.prototype.__query_for_searching = function(keyword, page, options) {
    var params = {};
 
    params["q"]  = keyword;

    if (page > 1) {
        params["pg"] = page;
    }

    return this.__to_query_string(params);
}

AskSteem.prototype.__to_query_string = function(params) {
    return Object.keys(params).map(function(k) {
        return k + "=" + params[k];
    }).join('&')
}

AskSteem.prototype.version = function() {
	return "1.0";
}

__MODULE__ = new AskSteem();

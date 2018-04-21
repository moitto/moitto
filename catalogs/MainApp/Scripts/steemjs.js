function SteemJS() {}

SteemJS.prototype.get_discussions_by_created = function(tag, limit, start_author, start_permlink, handler) {
    var url = "https://api.steemjs.com/get_discussions_by_created";
    var query = this.__query_for_discussions(tag, limit, start_author, start_permlink);

    fetch(url + "?" + "query=" + encodeURIComponent(query)).then(function(response){
        if (response.ok) {
           response.json().then(function(json) {
                handler(json);
            });
        }
    });
}

SteemJS.prototype.get_discussions_by_trending = function(tag, limit, start_author, start_permlink, handler) {
    var url = "https://api.steemjs.com/get_discussions_by_trending";
    var query = this.__query_for_discussions(tag, limit, start_author, start_permlink);

    fetch(url + "?" + "query=" + encodeURIComponent(query)).then(function(response){
        if (response.ok) {
           response.json().then(function(json) {
                handler(json);
            });
        }
    });
}

SteemJS.prototype.get_content = function(author, permlink, handler) {
	var url = "https://api.steemjs.com/get_content";
	var query = this.__query_for_content(author, permlink);

    fetch(url + "?" + query).then(function(response){
        if (response.ok) {
            response.json().then(function(json) {
                handler(json);
            });
        }
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

    return JSON.stringify(params);
}

SteemJS.prototype.__query_for_content = function(author, permlink) {
	var params = {};

	params["author"]   = author;
	params["permlink"] = permlink;

	return this.__to_query_string(params);
}

SteemJS.prototype.__to_query_string = function (params) {
    return Object.keys(params).map(function(k) {
        return k + "=" + params[k];
    }).join('&')
}

__MODULE__ = new SteemJS();

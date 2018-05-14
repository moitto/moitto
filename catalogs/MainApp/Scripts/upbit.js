Upbit = (function() {
    return {};
})();

Upbit.get_candles = function(currency, coin, count, handler) {
    var url = "https://crix-api-endpoint.upbit.com/v1/crix/candles/days";
    var query = Upbit.__query_for_candles(currency, coin, count);
    
    fetch(url+ "?" + query).then(function(response) {
        if (response.ok) {
            response.json().then(function(candles) {
                handler(candles);
            });
        }
    }, function(reason) {
        hanlder();
    });
}

Upbit.__query_for_candles = function(currency, coin, count) {
    var params = {};
    
    params["code"] = "CRIX.UPBIT." + currency.toUpperCase() + "-" + coin.toUpperCase();
    params["count"] = count;
 
    return Upbit.__to_query_string(params);
}

Upbit.__to_query_string = function(params) {
    return Object.keys(params).map(function(k) {
        return k + "=" + params[k];
    }).join('&')
}

Upbit.version = function() {
    return "1.0";
}

__MODULE__ = Upbit;

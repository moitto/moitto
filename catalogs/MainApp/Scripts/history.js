History = (function() {
    return {
        __updating : false,
        __history  : [],
        __handlers : []
    };
})();

History.steemjs = require("steemjs");

History.update = function(handler) {
    if (!History.__updating) {
        var username = storage.value("ACTIVE_USER");
        var earliest_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
        var last_updated_date = storage.value("HISTORY_UPDATED_DATE@" + username) || earliest_date;

        History.__update_history_for_account(username, Number.MAX_SAFE_INTEGER, 300, last_updated_date, function(history) {
            History.__handlers.forEach(function(handler) {
                handler(History.__history);
            });
            
            History.__handlers = [];
            History.__updating = false;
        });

        History.__history  = [];
        History.__updating = true;
    }

    History.__handlers.push(handler);
}

History.__update_history_for_account = function(account, from, count, last_updated_date, handler) {
    History.__get_history_for_account(account, from, count, last_updated_date).then(function(history) {
        var last_number = (history.length > 0) ? history[history.length - 1][0] : from;

        history.forEach(function(item) {
            History.__history.push(item);
        });

        if (history.length == count + 1 && last_number > 0) {
            History.__update_history_for_account(
                account, last_number - 1, count, last_updated_date, handler
            );

            return;
        }
        
        handler(last_number);
    }, function(reason) {
        handler();
    });
}

History.__get_history_for_account = function(account, from, count, last_updated_date) {
   return new Promise(function(resolve, reject) {
        var history = [];

        History.steemjs.get_account_history(account, from, count).then(function(response) {
            response = response.reverse();

            for (var i = 0; i < response.length; ++i) {
                var timestamp = response[i][1]["timestamp"];
                var op = response[i][1]["op"];
 
                if (last_updated_date > new Date(Date.parse(timestamp))) {
                    break;
                }

                history.push(response[i]);
            }

            resolve(history);
        }, function(reason) {
            reject(reason);
        });
    });
}

__MODULE__ = History;

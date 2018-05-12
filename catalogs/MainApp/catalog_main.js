var steemjs = require("steemjs");

var __updating_notif = false;

function on_loaded() {
	if (!__updating_notif) {
		__update_notif();
	}
}

function on_foreground() {
	if (!__updating_notif) {
		__update_notif();
	}
}

function __update_notif() {
	var username = storage.value("ACTIVE_USER");
	var earliest_date = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
   	var last_updated_date = storage.value("NOTIF_UPDATED_DATE") || earliest_date;

	__get_account_history_for_notif(username, last_updated_date).then(function(history) {

		__updating_notif = false;
	}, function(reason) {
		__updating_notif = false;
	});

	__updating_notif = true;
}

function __get_account_history_for_notif(account, last_updated_date) {
    return new Promise(function(resolve, reject) {
    	var history = [];

 		steemjs.get_account_history(account, Number.MAX_SAFE_INTEGER, 300).then(function(response) {
 			response = response.reverse();

 			for (var i = 0; i < response.length; ++i) {
 				var timestamp = response[i][1]["timestamp"];
 				var op = response[i][1]["op"];

 				if (last_updated_date > new Date(Date.parse(timestamp))) {
 					break;
 				}

 				if (__is_notify_op_for_account(op, account)) {
 					history.push(response[i][1]);
 				}
 			}

			history.forEach(function(data) {
				console.log(JSON.stringify(data["op"]));
			});

			resolve(history);
		}, function(reason) {
			reject(reason);
		});
    });
}

function __is_notify_op_for_account(op, account) {
 	if (op[0] === "comment") {
 		if (op[1]["author"] !== account) {
 			return true;
 		}

		return false;
 	}

 	if (op[0] === "vote") {
 		if (op[1]["author"] === account) {
 			return true;
 		}

		return false;
 	}

 	if (op[0] === "custom_json" && op[1]["id"] === "follows") {
 		var json = JSON.parse(op[1]["json"]);

 		if (json[1]["following"] === account) {
 			return true;
		}

		return false;
 	}

 	if (op[0] === "transfer") {
 		if (op[1]["to"] === account) {
			return true;
 		}
	
		return false;
 	}

 	return false;
}

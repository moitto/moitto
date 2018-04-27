var account = require("account");

function login(form) {
    account.login(form["username"], form["password"], function(response) {
    	
    });
}

var account = require("account");

function reset(form) {
    host.action("script", { 
        "script":$data["script"],
        "password":form["password"] 
    });
}

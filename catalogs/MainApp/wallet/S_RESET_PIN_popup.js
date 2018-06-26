var account = require("account");

function reset(form) {
	console.log("reset::", $data["script"]);

    host.action("script", { "script":$data["script"] });
}

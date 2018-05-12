var account = require("account");

function on_loaded() {
	var vote = document.value("VOTE");

    account.vote(vote["author"], vote["permlink"], vote["weight"], function(response) {
        view.data("display-unit", { "voted":"yes" });

       	controller.action("popup", { 
       	    "display-unit":$data["id"],
       	    "alternate-name":"discussion.vote.done",
            "dir-path":$data["dir-path"]
		});
    });	
}

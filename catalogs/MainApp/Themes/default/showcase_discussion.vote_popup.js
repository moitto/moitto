function on_loaded() {
    
}

function vote(form) {
	document.value("VOTE", {
		author:$data["author"],
		permlink:$data["permlink"],
		weight:10000
	});

	controller.action("popup", { 
		"display-unit":$data["id"],
		"alternate-name":"discussion.voting",
		"dir-path":$data["dir-path"]
	});
}

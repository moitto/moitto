function on_loaded() {
	var images = __get_images_in_content($data["body"]);

	images.forEach(function(image) {
		console.log(image.url);
	});
}

function __get_images_in_content(body) {
	var pattern = /!\[([^\]]*)\]\(([^\)]+)\)/g;
	var matched = null;
	var images = [];

	while (matched = pattern.exec(body)) {
		images.push({
			"position":[ matched.index, pattern.lastIndex ],
			"alt":matched[1], 
			"url":matched[2]
		});
	}
    
    return images;
}

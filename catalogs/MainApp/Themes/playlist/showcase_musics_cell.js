var youtube = require("youtube");

var item_index = 0;

function feed_video(keyword, location, length, sortkey, sortorder, handler) {
	youtube.search_music($data["title"], $data["artists"].split(",")[0], function(items) {
                         console.log("search_music");
		var data = [];

		items.forEach(function(item) {
			data.push({
				"video-id":item
			});
		});

		handler(data);
	});		
}

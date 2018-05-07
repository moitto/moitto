var youtube = require("youtube");

var item_index = 0;

function feed_video(keyword, location, length, sortkey, sortorder, handler) {
    youtube.search_musics($data["title"], $data["artists"].split(",")[0], function(items) {
        var data = [];

        items.forEach(function(item) {
            data.push({
                "video-id":item
            });
        });

        handler(data);
    });        
}

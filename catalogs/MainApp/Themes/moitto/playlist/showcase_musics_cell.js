var youtube = require("youtube");

function feed_video(keyword, location, length, sortkey, sortorder, handler) {
    youtube.search_musics($data["title"], $data["artists"].split(",")[0], function(items) {
        var data = [];

        items.forEach(function(item) {
            data.push({
                "video-id":item, 
                "music-id":$data["id"]
            });
        });

        handler(data);
    });        
}

function prev_music() {
    owner.action("script", { "script":"prev_music" });
}

function next_music() {
    owner.action("script", { "script":"next_music" });
}

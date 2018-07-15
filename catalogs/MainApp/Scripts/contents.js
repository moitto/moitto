Contents = (function() {
    return {
        __nsfw_tags:(function() {
            var values = controller.catalog().values("showcase", "nsfw.tags", null, null, [ 0, 100 ]);
            var tags = [];

            values.forEach(function(value) {
                tags.push(value["tag"]);
            });

            return tags;
        })()
    };
})();

Contents.urls     = require("urls");
Contents.settings = require("settings");

// class Content

function Content(data) {
    this.data = data;
    this.meta = JSON.parse(data["json_metadata"] || "{}");
}

Content.prototype.get_title_image_url = function(size) {
    var images = this.meta["image"];

    if (images && images.length > 0) {
        if (size) {
            return "https://steemitimages.com/" + size +"/" + images[0];
        }

        return images[0];
    }

    return "";
}

Content.prototype.get_title_video_id = function() {
    var urls = this.__get_external_urls();

    if (urls.length < 3) {
        var youtube_video_id = this.__get_youtube_video_id(urls);
 
        if (youtube_video_id) {
            return [ "youtube", youtube_video_id ];
        }
    }
}

Content.prototype.get_author_reputation = function() {
    var reputation = this.data["author_reputation"];

    if (reputation < 0) {
        return 25 - (Math.log10(-reputation) - 9) * 9;
    }

    return (Math.log10(reputation) - 9) * 9 + 25;
}

Content.prototype.get_payout_value = function() {
    var total_payout_value = parseFloat(this.data["total_payout_value"].split(" ")[0]);
    
    if (total_payout_value > 0) {
        return total_payout_value;
    }
    
    return parseFloat(this.data["pending_payout_value"].split(" ")[0]);
}

Content.prototype.get_userpic_url = function(size) {
    var userpic_url = "https://steemitimages.com/u/" + this.data["author"] + "/avatar";

    if (size) {
        userpic_url = userpic_url + "/" + size;
    }

    return userpic_url;
}

Content.prototype.get_vote_weight = function(username) {
    var votes = this.data["active_votes"];

    for (var i = 0; i < votes.length; i++) {
        if (votes[i].voter === username) {
            return votes[i].percent;
        }
    }

    return 0;
}

Content.prototype.is_payout = function() {
    if (this.data["last_payout"] !== "1970-01-01T00:00:00") {
        return true;
    }

    return false;
}

Content.prototype.is_allowed = function() {
    if (this.is_nsfw() && !Contents.settings.nsfw_contents_allowed()) {
        return false;
    }

    if (this.is_banned()) {
        return false;
    }

    return true;
}

Content.prototype.is_nsfw = function() {
    for (var index = 0; index < Contents.__nsfw_tags.length; ++index) {
        console.log(Contents.__nsfw_tags[index]);
        if (this.meta["tags"].includes(Contents.__nsfw_tags[index])) {
            return true;
        }
    }

    return false;
}

Content.prototype.is_banned = function() {
    if (this.get_author_reputation() <= 0) {
        return true;
    }

    return false;
}

Content.prototype.__get_external_urls = function() {
    var urls = [];

    for (var i = 0; i < (this.meta["links"] || []).length; ++i) {
        var steem_url = Contents.urls.parse_steem_url(this.meta["links"][i]);

        if (!steem_url) {
            urls.push(this.meta["links"][i]);
        }
    }

    return urls;
}

Content.prototype.__get_youtube_video_id = function(urls) {
    for (var i = 0; i < urls.length; ++i) {
        var video_id = Contents.urls.get_youtube_video_id(urls[i]);

        if (video_id) {
            return video_id;
        }
    }
}

// instance factory

Contents.create = function(data) {
    return new Content(data);
}

__MODULE__ = Contents;

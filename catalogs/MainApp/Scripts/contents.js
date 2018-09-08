Contents = (function() {
    return {};
})();

Contents.urls = require("urls");

// class Content

function Content(data, replies) {
    this.data = data;
    this.replies = replies || [];
    this.meta = JSON.parse(data["json_metadata"] || "{}");

    console.log(JSON.stringify(replies));
    
    if (this.meta["image"]) {
        this.meta["image"] = this.__normalize_urls(this.meta["image"]);
    }
}

Content.prototype.get_title_image_url = function(size) {
    var images = this.meta["image"];

    if (images && images.length > 0) {
        var image_url = images[0].replace(/\"/g, "");

        if (size) {
            return "https://steemitimages.com/" + size +"/" + image_url;
        }

        return image_url;
    }
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
        return 25 - (Math.max(Math.log10(-reputation) || 0, 9) - 9) * 9;
    }

    return (Math.max(Math.log10(reputation) || 0, 9) - 9) * 9 + 25;
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
        if (votes[i]["voter"] === username) {
            return votes[i].percent;
        }
    }

    return 0;
}

Content.prototype.get_vote_weight_after_payout = function(username) {
    for (var n = 0; n < this.replies.length; ++n) {
        if (this.replies[n]["permlink"].startsWith("after7days-")) {
            var votes = this.replies[n]["active_votes"];

            for (var i = 0; i < votes.length; i++) {
                if (votes[i]["voter"] === username) {
                    return votes[i].percent;
                }
            }
        }
    }

    return 0;
}

Content.prototype.is_owner = function(username) {
    if (this.data["author"] === username) {
        return true;
    }

    return false;  
}

Content.prototype.is_payout_done = function() {
    if (this.data["last_payout"] !== "1970-01-01T00:00:00") {
        return true;
    }

    return false;
}

Content.prototype.is_payout_declined = function() {
    return false;
}

Content.prototype.is_allowed = function(disallowed_tags) {
    for (var index = 0; index < this.meta["tags"].length; ++index) {
        if (disallowed_tags.includes(this.meta["tags"][index].toLowerCase())) {
            return false;
        }
    }

    return true;
}

Content.prototype.is_banned = function() {
    if (this.get_author_reputation() <= 0) {
        return true;
    }

    return false;
}

Content.prototype.is_editable = function(username) {
    if (this.is_owner(username) && !this.is_payout_done()) {
        return true;
    }

    return false;
}

Content.prototype.is_deletable = function(username) {
    if (this.is_editable(username) && this.data["children"] == 0) {
        return true;
    }

    return false;
}

Content.prototype.is_hidable = function(username) {
    if (this.data["parent_author"] === username && !this.is_payout_done()) {
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

Content.prototype.__normalize_urls = function(urls) {
    var normalized_urls = [];

    urls.forEach(function(url) {
        normalized_urls.push(decode("html", url));
    });

    return normalized_urls;
}

// instance factory

Contents.create = function(data, replies) {
    return new Content(data, replies);
}

__MODULE__ = Contents;

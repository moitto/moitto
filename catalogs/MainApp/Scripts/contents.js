Contents = (function() {
    return {};
})();

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

Content.prototype.get_author_reputation = function() {
    return (Math.log10(this.data["author_reputation"]) - 9) * 9 + 25;
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

// instance factory

Contents.create = function(data) {
    return new Content(data);
}

__MODULE__ = Contents;

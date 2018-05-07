Contents = (function() {
    return {};
})();

// class Content

function Content(data) {
	this.data = data;
	this.meta = JSON.parse(data["json_metadata"]);
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

Content.prototype.is_voted = function(username) {
    var votes = this.data["active_votes"];

    for (var i = 0; i < votes.length; i++) {
        if (votes[i].voter === username) {
            return true;
        }
    }

    return false;
}

// instance factory

Contents.create = function(data) {
    return new Content(data);
}

__MODULE__ = Contents;

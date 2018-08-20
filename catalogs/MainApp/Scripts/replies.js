Replies = (function() {
    return {};
})();

// class User

function Reply(data) {
    this.data = data;
}

Reply.prototype.get_author_reputation = function() {
    var reputation = this.data["author_reputation"];

    if (reputation < 0) {
        return 25 - (Math.max(Math.log10(-reputation) || 0, 9) - 9) * 9;
    }

    return (Math.max(Math.log10(reputation) || 0, 9) - 9) * 9 + 25;
}

Reply.prototype.get_payout_value = function() {
    var total_payout_value = parseFloat(this.data["total_payout_value"].split(" ")[0]);
    
    if (total_payout_value > 0) {
        return total_payout_value;
    }
    
    return parseFloat(this.data["pending_payout_value"].split(" ")[0]);
}

Reply.prototype.get_userpic_url = function(size) {
    var userpic_url = "https://steemitimages.com/u/" + this.data["author"] + "/avatar";

    if (size) {
        userpic_url = userpic_url + "/" + size;
    }

    return userpic_url;
}

Reply.prototype.get_vote_weight = function(username) {
    var votes = this.data["active_votes"];

    for (var i = 0; i < votes.length; i++) {
        if (votes[i].voter === username) {
            return votes[i].percent;
        }
    }

    return 0;
}

Reply.prototype.is_owner = function(username) {
    if (this.data["author"] === username) {
        return true;
    }

    return false;  
}

Reply.prototype.is_payout_done = function() {
    if (this.data["last_payout"] !== "1970-01-01T00:00:00") {
        return true;
    }

    return false;
}

Reply.prototype.is_payout_declined = function() {
    return false;
}

Reply.prototype.is_banned = function() {
    if (this.get_author_reputation() <= 0) {
        return true;
    }

    return false;
}

Reply.prototype.is_down_voted = function(username) {
    if (this.get_vote_weight(username) < 0) {
        return true;
    }

    return false;
}

Reply.prototype.is_editable = function(username) {
    if (this.is_owner(username) && !this.is_payout_done()) {
        return true;
    }

    return false;
}

Reply.prototype.is_deletable = function(username) {
    if (this.is_editable(username) && this.data["children"] == 0) {
        return true;
    }

    return false;
}

Reply.prototype.is_hidable = function(username) {
    if (this.data["parent_author"] === username && !this.is_payout_done()) {
        return true;
    }

    return false;
}

// instance factory

Replies.create = function(data) {
    return new Reply(data);
}

__MODULE__ = Replies;

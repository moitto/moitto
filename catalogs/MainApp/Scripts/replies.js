Replies = (function() {
    return {};
})();

// class User

function Reply(data) {
    this.data = data;
}

Reply.prototype.get_reputation = function() {
    return (Math.log10(this.data["reputation"]) - 9) * 9 + 25;
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

// instance factory

Replies.create = function(data) {
    return new Reply(data);
}

__MODULE__ = Replies;

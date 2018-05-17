Votes = (function() {
    return {};
})();

// class User

function Vote(data) {
    this.data = data;
}

Vote.prototype.get_reputation = function() {
    return (Math.log10(this.data["reputation"]) - 9) * 9 + 25;
}

Vote.prototype.get_userpic_url = function(size) {
    var userpic_url = "https://steemitimages.com/u/" + this.data["voter"] + "/avatar";

    if (size) {
        userpic_url = userpic_url + "/" + size;
    }

    return userpic_url;
}

// instance factory

Votes.create = function(data) {
    return new Vote(data);
}

__MODULE__ = Votes;

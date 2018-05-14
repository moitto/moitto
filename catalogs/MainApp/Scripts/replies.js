Replies = (function() {
    return {};
})();

// class Content

function Reply(data) {
    this.data = data;
}

// instance factory

Replies.create = function(data) {
    return new Reply(data);
}

__MODULE__ = Replies;

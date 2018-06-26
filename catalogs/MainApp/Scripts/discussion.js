Discussion = (function() {
    return {};
})();

Discussion.account = require("account");

Discussion.upvote = function(author, permlink, weight, handler) {
    Discussion.account.vote(author, permlink, weight, function(response) {
        handler(response);
    });
}

Discussion.downvote = function(author, permlink, weight, handler) {

}

Discussion.unvote = function(author, permlink, handler) {

}

__MODULE__ = Discussion;

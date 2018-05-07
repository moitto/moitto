Users = (function() {
    return {};
})();

// class User

function User(name, data, follows, dynprops) {
    this.name     = name;
    this.data     = data;
    this.follows  = follows;
    this.dynprops = dynprops;
}

User.prototype.get_reputation = function() {
    return (Math.log10(this.data["reputation"]) - 9) * 9 + 25;
}

User.prototype.get_post_count = function() {
    return this.data["post_count"];
}

User.prototype.get_following_count = function() {
    return this.follows["following_count"];
}

User.prototype.get_follower_count = function() {
    return this.follows["follower_count"];
}

User.prototype.get_steem_balance = function() {
    return parseFloat(this.data["balance"].split(" ")[0]);
}

User.prototype.get_sbd_balance = function() {
    return parseFloat(this.data["sbd_balance"].split(" ")[0]);
}

User.prototype.get_steem_power = function() {
    var vesting_shares  = this.data["vesting_shares"].split(" ")[0];
    var steems_per_vest = this.dynprops.get_steems_per_vest();
                
    return steems_per_vest * parseFloat(vesting_shares);
}

// instance factory

Users.create = function(name, data, follows, dynprops) {
    return new User(name, data, follows, dynprops);
}

__MODULE__ = Users;

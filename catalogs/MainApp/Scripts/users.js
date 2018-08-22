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
    var reputation = this.data["reputation"];

    if (reputation < 0) {
        return 25 - (Math.max(Math.log10(-reputation) || 0, 9) - 9) * 9;
    }

    return (Math.max(Math.log10(reputation) || 0, 9) - 9) * 9 + 25;
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

User.prototype.get_voting_power = function() {
    return this.data["voting_power"] / 100.0;
}

User.prototype.get_voting_amount = function(weight) {
    var steems_per_vest = this.dynprops.get_steems_per_vest();

    return 0.0126 * (weight / 1000.0);
}

User.prototype.get_minimum_voting_weight = function() {
    return 200;
}

User.prototype.get_steem_balance = function() {
    return parseFloat(this.data["balance"].split(" ")[0]);
}

User.prototype.get_sbd_balance = function() {
    return parseFloat(this.data["sbd_balance"].split(" ")[0]);
}

User.prototype.get_steem_power = function() {
    var vesting_shares  = parseFloat(this.data["vesting_shares"].split(" ")[0]);
    var steems_per_vest = this.dynprops.get_steems_per_vest();

    return steems_per_vest * vesting_shares;
}

User.prototype.get_delegated_steem_power = function() {
    var vesting_shares  = parseFloat(this.data["delegated_vesting_shares"].split(" ")[0]);
    var steems_per_vest = this.dynprops.get_steems_per_vest();

    return steems_per_vest * vesting_shares;
}

User.prototype.get_received_steem_power = function() {
    var vesting_shares  = parseFloat(this.data["received_vesting_shares"].split(" ")[0]);
    var steems_per_vest = this.dynprops.get_steems_per_vest();

    return steems_per_vest * vesting_shares;
}

User.prototype.get_reward_steem_balance = function() {
    return parseFloat(this.data["reward_steem_balance"].split(" ")[0]);
}

User.prototype.get_reward_sbd_balance = function() {
    return parseFloat(this.data["reward_sbd_balance"].split(" ")[0]);
}

User.prototype.get_reward_steem_power = function() {
    var vesting_shares  = parseFloat(this.data["reward_vesting_balance"].split(" ")[0]);
    var steems_per_vest = this.dynprops.get_steems_per_vest();

    return steems_per_vest * vesting_shares;
}

User.prototype.has_rewards = function() {
    if (parseFloat(this.data["reward_steem_balance"].split(" ")[0]) > 0) {
        return true;
    }

    if (parseFloat(this.data["reward_sbd_balance"].split(" ")[0]) > 0) {
        return true;
    }

    if (parseFloat(this.data["reward_vesting_balance"].split(" ")[0]) > 0) {
        return true;
    }

    return false;
}

User.prototype.get_userpic_url = function(size) {
    var userpic_url = "https://steemitimages.com/u/" + this.name + "/avatar";

    if (size) {
        userpic_url = userpic_url + "/" + size;
    }

    return userpic_url;
}

// instance factory

Users.create = function(name, data, follows, dynprops) {
    return new User(name, data, follows, dynprops);
}

__MODULE__ = Users;

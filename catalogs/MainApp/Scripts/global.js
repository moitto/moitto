Global = (function() {
    return {};
})();

Global.steemjs  = require("steemjs");
Global.users    = require("users");
Global.contents = require("contents");

// class DynProps

function DynProps(data) {
    this.data = data;
}

DynProps.prototype.get_steems_per_vest = function() {
    var total_vesting_fund_steem = this.data["total_vesting_fund_steem"].split(" ")[0];
    var total_vesting_shares = this.data["total_vesting_shares"].split(" ")[0];
    
    return parseFloat(total_vesting_fund_steem) / parseFloat(total_vesting_shares);
}

// methods

Global.get_user = function(username, handler) {
    Global.steemjs.get_accounts([ username ], function(response) {
        var data = response[0];

        Global.steemjs.get_follow_count(username, function(response) {
            var follows = response;

            Global.get_dynprops(function(dynprops) {
                handler(Global.users.create(username, data, follows, dynprops));
            });
        });
    });    
}

Global.get_content = function(author, permlink, handler) {
    Global.steemjs.get_content(author, permlink, function(response) {
        handler(Global.contents.create(response));
    });    
}

Global.get_dynprops = function(handler) {
    Global.steemjs.get_dynamic_global_properties(function(response) {
        handler(new DynProps(response));
    });
}

__MODULE__ = Global;

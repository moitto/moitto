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

Global.get_dynprops = function() {
    return new Promise(function(resolve, reject) {
        Global.steemjs.get_dynamic_global_properties().then(function(response) {
            resolve(new DynProps(response));
        }, function(reason) {
            reject(reason);
        }); 
    });   
}

Global.get_user = function(username) {
    return new Promise(function(resolve, reject) {
        Promise.all([
            Global.steemjs.get_accounts([ username ]),
            Global.steemjs.get_follow_count(username),
            Global.steemjs.get_dynamic_global_properties()
        ]).then(function(response) {
            console.log(JSON.stringify(response[2]));
            resolve(Global.users.create(username, response[0][0], response[1], new DynProps(response[2])));
        }, function(reason) {
            reject(reason);
        });
    });
}

Global.get_content = function(author, permlink) {
    return new Promise(function(resolve, reject) {
        Global.steemjs.get_content(author, permlink).then(function(response) {
            resolve(Global.contents.create(response));
        }, function(reason) {
            reject(reason);
        }); 
    });   
}

__MODULE__ = Global;

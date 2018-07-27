Global = (function() {
    return {};
})();

// class DynProps

function DynProps(data) {
    this.data = data;
}

DynProps.prototype.get_steems_per_vest = function() {
    var total_vesting_fund_steem = this.data["total_vesting_fund_steem"].split(" ")[0];
    var total_vesting_shares = this.data["total_vesting_shares"].split(" ")[0];
    
    return parseFloat(total_vesting_fund_steem) / parseFloat(total_vesting_shares);
}

// instance factory

Global.create = function(data) {
    return new DynProps(data);
}

__MODULE__ = Global;

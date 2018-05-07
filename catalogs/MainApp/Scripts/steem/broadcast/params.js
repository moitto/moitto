var __TYPES__ = SteemSerializer.types;

__MODULE__ = {
    "vote":{
        voter: __TYPES__.string,
        author: __TYPES__.string,
        permlink: __TYPES__.string,
        weight: __TYPES__.int16
    },
    "transfer":{
        from: __TYPES__.string,
        to: __TYPES__.string,
        amount: __TYPES__.asset,
        memo: __TYPES__.string
    }
};

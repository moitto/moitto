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
    },
    "account_create":{
        fee: __TYPES__.asset,
        creator: __TYPES__.string,
        new_account_name: __TYPES__.string,
        owner: __TYPES__.authority,
        active: __TYPES__.authority,
        posting: __TYPES__.authority,
        memo_key: __TYPES__.public_key,
        json_metadata: __TYPES__.string
    },
    "custom_json":{
        required_auths: __TYPES__.array,
        required_posting_auths: __TYPES__.array,
        id: __TYPES__.string,
        json: __TYPES__.string
    }
};

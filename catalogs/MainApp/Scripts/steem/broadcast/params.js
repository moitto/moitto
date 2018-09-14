var __TYPES__ = SteemSerializer.types;

__MODULE__ = {
    "vote":{
        voter: __TYPES__.string,
        author: __TYPES__.string,
        permlink: __TYPES__.string,
        weight: __TYPES__.int16
    },
    "comment":{
        parent_author: __TYPES__.string,
        parent_permlink: __TYPES__.string,
        author: __TYPES__.string,
        permlink: __TYPES__.string,
        title: __TYPES__.string,
        body: __TYPES__.string,
        json_metadata: __TYPES__.string
    },
    "transfer":{
        from: __TYPES__.string,
        to: __TYPES__.string,
        amount: __TYPES__.asset,
        memo: __TYPES__.string
    },
    "transfer_to_vesting":{
        from: __TYPES__.string,
        to: __TYPES__.string,
        amount: __TYPES__.asset
    },
    "withdraw_vesting":{
        account: __TYPES__.string,
        vesting_shares: __TYPES__.asset
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
    "delete_comment":{
        author: __TYPES__.string,
        permlink: __TYPES__.string
    },
    "custom_json":{
        required_auths: [ __TYPES__.array, __TYPES__.string ],
        required_posting_auths: [ __TYPES__.array, __TYPES__.string ],
        id: __TYPES__.string,
        json: __TYPES__.string
    },
    "comment_options":{
        author: __TYPES__.string,
        permlink: __TYPES__.string,
        max_accepted_payout: __TYPES__.asset,
        percent_steem_dollars: __TYPES__.uint16,
        allow_votes: __TYPES__.bool,
        allow_curation_rewards: __TYPES__.bool,
        extensions: [ __TYPES__.array, __TYPES__.beneficiaries ]
    },
    "delegate_vesting_shares":{
        delegator: __TYPES__.string,
        delegatee: __TYPES__.string,
        vesting_shares: __TYPES__.asset
    },
    "escrow_transfer":{
        from: __TYPES__.string,
        to: __TYPES__.string,
        agent: __TYPES__.string,
        escrow_id: __TYPES__.unit32,
        sbd_amount: __TYPES__.asset,
        steem_amount: __TYPES__.asset,
        fee: __TYPES__.asset,
        ratification_deadline: __TYPES__.string,
        escrow_expiration: __TYPES__.string,
        json_metadata: __TYPES__.string
    },
    "escrow_dispute":{
        from: __TYPES__.string,
        to: __TYPES__.string,
        agent: __TYPES__.string,
        who: __TYPES__.string,
        escrow_id: __TYPES__.unit32
    },
    "escrow_release":{
        from: __TYPES__.string,
        to: __TYPES__.string,
        agent: __TYPES__.string,
        who: __TYPES__.string,
        receiver: __TYPES__.string,
        escrow_id: __TYPES__.unit32,
        sbd_amount: __TYPES__.asset,
        steem_amount: __TYPES__.asset
    },
    "escrow_approve":{
        from: __TYPES__.string,
        to: __TYPES__.string,
        agent: __TYPES__.string,
        who: __TYPES__.string,
        escrow_id: __TYPES__.unit32,
        approve: __TYPES__.string
    },
    "claim_reward_balance":{
        account: __TYPES__.string,
        reward_steem: __TYPES__.asset,
        reward_sbd: __TYPES__.asset,
        reward_vests: __TYPES__.asset
    }
};

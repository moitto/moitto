Steem = (function() {
    return {};
})();

Steem.__MAINNET__ = { pub_header:0x0, priv_header:0x80, pub_prefix:'STM' }; 
Steem.__TESTNET__ = { pub_header:0x0, priv_header:0x80, pub_prefix:'TST' };

Steem.net = Steem.__MAINNET__;
Steem.chain_id = "0000000000000000000000000000000000000000000000000000000000000000";

Steem.crypto    = require('crypto');
Steem.struct    = require('struct');
Steem.auth      = include('./auth/index.js');
Steem.broadcast = include('./broadcast/index.js');
Steem.api       = include('./api/index.js');

Steem.enable_testnet = function() {
    Steem.net = Steem.__TESTNET__;
}

Steem.version = function() {
    return "1.0";
}

__MODULE__ = Steem;

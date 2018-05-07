SteemAuth = (function() {
    return {};
})();

SteemAuth.signature = include("./signature.js");

SteemAuth.generate_keys = function(name, password, roles) {
    var keys = {};
    
    roles.forEach(function(role) {
        var seed = name + role + password;
        var brain_key = seed.trim().split(/[\t\n\v\f\r ]+/).join(' ');
        var secret = Steem.crypto.number_from_bits(
            Steem.crypto.sha256.hash(Steem.crypto.string_to_bits(brain_key))
        );
        var curve = Steem.crypto.ecdsa.curve_from_name("k256");
        var pair = Steem.crypto.ecdsa.generate_keys(curve, secret);
        var public_key  = SteemAuth.__build_public_key (pair.pub);
        var private_key = SteemAuth.__build_private_key(pair.sec);

        keys[role] = { pub:public_key, priv:private_key };
    });
    
    return keys;
}

SteemAuth.sign_transaction = function(transcation, keys) {
    var message = decode("hex", Steem.chain_id).concat(transcation);
    var signatures = [];

    for (var key in keys) {
        var private_key = SteemAuth.__strip_private_key(keys[key]);

        signatures.push(
            Steem.crypto.hex_from_bits(
                SteemAuth.signature.sign_buffer(message, private_key)
            )
        );
    };

    return signatures;
}

SteemAuth.__build_public_key = function(key) {
    var header = Steem.net.pub_header;
    var point = key.get();

    if (Steem.crypto.number_from_bits(point.y).limbs[0] & 0x1) {
        header |= 0x3;
    } else {
        header |= 0x2;
    }

    return (
        Steem.net.pub_prefix + Steem.crypto.base58.check.encode(
            header, point.x, SteemAuth.__checksum_for_key
        )
    );
}

SteemAuth.__build_private_key = function(key) {
    return Steem.crypto.base58.check.encode(
        Steem.net.priv_header, key.get()
    );
}

SteemAuth.__strip_private_key = function(key) {
    var wif = Steem.crypto.base58.check.decode(key);
    var curve = Steem.crypto.ecdsa.curve_from_name("k256");

    return Steem.crypto.ecdsa.secret_key(
        curve, Steem.crypto.bits_slice(wif, 8)
    );
}

SteemAuth.__checksum_for_key = function(bits) {
    return Steem.crypto.bits_slice(
        Steem.crypto.ripemd160.hash(bits), 0, 32
    );
}

__MODULE__ = SteemAuth;

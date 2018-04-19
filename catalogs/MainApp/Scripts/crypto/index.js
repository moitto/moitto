include("./sjcl/sjcl.js");
include("./sjcl/bitArray.js");
include("./sjcl/codecString.js");
include("./sjcl/codecBytes.js");
include("./sjcl/codecBase58.js");
include("./sjcl/codecBase58Check.js");
include("./sjcl/sha256.js");
include("./sjcl/ripemd160.js");
include("./sjcl/aes.js");
include("./sjcl/random.js");
include("./sjcl/bn.js");
include("./sjcl/ecc.js");

Crypto = (function() {
	sjcl.random.addEntropy(random(1024));

	return {};
})();

Crypto.sha256 = {
	hash : function(data) {
    	return sjcl.hash.sha256.hash(data);
	}
};

Crypto.ripemd160 = {
	hash : function(data) {
    	return sjcl.hash.ripemd160.hash(data);
	}
};

Crypto.ecdsa = {
	generate_keys : function(curve_name, secret) {
		return sjcl.ecc.ecdsa.generateKeys(
			sjcl.ecc.curves[curve_name], 0, secret
		);
	}
};

Crypto.base58 = {
	encode : function(bits) {
		return sjcl.codec.base58.fromBits(bits);
	},
	check : {
		encode : function(version, bits, checksum_fn) {
			return sjcl.codec.base58Check.fromBits(version, bits, checksum_fn);
		}
	}
};

Crypto.number_from_bits = function(bits) {
	return sjcl.bn.fromBits(bits);
};

Crypto.string_to_bits = function(string) {
	return sjcl.codec.utf8String.toBits(string);
};

Crypto.bits_slice = function(bits, start, end) {
    return sjcl.bitArray.bitSlice(bits, start, end);
};

Crypto.version = function() {
	return "1.0";
};

module = Crypto;

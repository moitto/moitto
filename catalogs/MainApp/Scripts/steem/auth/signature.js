SteemSignature = (function() {
    return {};
})();

SteemSignature.sign_message = function(message, key) {
    var digest = Steem.crypto.sha256.hash(Steem.crypto.bytes_to_bits(message));
    var paranoia = 0;
    
    while (true) {
        var n = key._curve.r,
            l = n.bitLength(),
            k = sjcl.bn.random(n.sub(1), paranoia).add(1),
            R = key._curve.G.mult(k);

        if (R.isIdentity) {
            continue;
        }
        
        var r = R.x.mod(n),
            ss = sjcl.bn.fromBits(digest).add(r.mul(key._exponent)),
            s = ss.mul(k.inverseMod(n)).mod(n),
            isOdd = (R.y.limbs[0] & 0x1) == 1,
            recoveryParam = isOdd ? 32 : 31;
        
        var rBitArray = r.toBits(l);
        var sBitArray = s.toBits(l);
        
        var r0 = sjcl.bitArray.extract(rBitArray, 0, 8);
        var r1 = sjcl.bitArray.extract(rBitArray, 8, 8);
        var s0 = sjcl.bitArray.extract(sBitArray, 0, 8);
        var s1 = sjcl.bitArray.extract(sBitArray, 8, 8);
        
        if (!(r0 & 0x80)
            && !(r0 == 0 && !(r1 & 0x80))
            && !(s0 & 0x80)
            && !(s0 == 0 && !(s1 & 0x80))) {
            var rawSig = sjcl.bitArray.concat(r.toBits(l), s.toBits(l));
            
            return sjcl.bitArray.concat(
                [sjcl.bitArray.partial(8, recoveryParam)], rawSig
            );
        }
    }
}

__MODULE__ = SteemSignature;

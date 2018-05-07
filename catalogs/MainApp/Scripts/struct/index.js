Struct = (function() {
    return {};
})();

Struct.jspack = include("./jspack.js");

Struct.pack = function(format, values) {
    return Struct.jspack.Pack(format, values);
}

Struct.unpack = function(format, bytes, offset) {
    return Struct.jspack.Unpack(format, bytes, offset);
}

Struct.version = function() {
    return "1.0";
}

__MODULE__ = Struct;

var jspack = include("./jspack.js");

function Struct() {}

Struct.prototype.pack = function(format, values) {
	return jspack.Pack(format, values);
}

Struct.prototype.unpack = function(format, bytes, offset) {
	return jspack.Unpack(format, bytes, offset);
}

Struct.prototype.version = function() {
	return "1.0";
}

__MODULE__ = new Struct();

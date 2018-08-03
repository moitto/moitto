SteemSerializer = (function() {
    return {};
})();

SteemSerializer.types  = include("./types.js");
SteemSerializer.params = include("./params.js");
SteemSerializer.utfx   = require("utfx");

SteemSerializer.serialize_transaction = function(transaction) {
    var buffer = [];
    
    SteemSerializer.__pack_buffer(buffer, "<H", [ transaction["ref_block_num"] ]);
    SteemSerializer.__pack_buffer(buffer, "<I", [ transaction["ref_block_prefix"] ]);
    SteemSerializer.__pack_buffer(buffer, "<I", [ new Date(transaction["expiration"] + 'Z').getTime() / 1000 ]);

    SteemSerializer.__pack_buffer(buffer, "B", [ transaction["operations"].length ]);
    transaction["operations"].forEach(function(operation) {
        var params = operation[1];

        SteemSerializer.__find_operation(operation[0], function(index, operation) {
            SteemSerializer.__pack_buffer(buffer, "B", [ index ]);

            operation["params"].forEach(function(param) {
                var serializer = SteemSerializer.params[operation.operation][param];

                if (serializer instanceof Array) {
                    serializer[0].pack(buffer, params[param], serializer[1]);
                } else {
                    serializer.pack(buffer, params[param]);
                }
            });
        });
    });

    SteemSerializer.__pack_buffer(buffer, "B", [ transaction["extensions"].length ]);
    transaction["extensions"].forEach(function(extension) {
        // TBD
    });

    return buffer;
}

SteemSerializer.__find_operation = function(name, handler) {
    for (var index = 0; index < SteemBroadcast.operations.length; index++) {
        var operation = SteemBroadcast.operations[index];
        if (operation.operation === name) {
            handler(index, operation);
            
            break;
        }
    }
}

SteemSerializer.__pack_buffer_varint32 = function(buffer, value) {
    value >>>= 0;

    while (value >= 0x80) {
        SteemSerializer.__pack_buffer(buffer, "B", [ (value & 0x7f) | 0x80 ]);
        value >>>= 7;
    }
    
    SteemSerializer.__pack_buffer(buffer, "B", [ value ]);
}

SteemSerializer.__pack_buffer = function(buffer, format, values) {
    Steem.struct.pack(format, values).forEach(function(byte) {
        buffer.push(byte);
    });
}

SteemSerializer.__stringSource = function(string) {
    var i = 0; 

    return function() {
        return i < string.length ? string.charCodeAt(i++) : null;
    };
}

__MODULE__ = SteemSerializer;

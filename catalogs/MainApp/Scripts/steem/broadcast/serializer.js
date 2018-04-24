SteemSerializer = {};

SteemSerializer.operations = include("./operations.js"); 
SteemSerializer.params     = include("./params.js");

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
                SteemSerializer.params[operation.operation][param].pack(
                    buffer, params[param]
                );
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
    for (var index = 0; index < SteemSerializer.operations.length; index++) {
        var operation = SteemSerializer.operations[index];

        if (operation.operation === name) {
            handler(index, operation);
            
            break;
        }
    }
}

SteemSerializer.__pack_buffer = function(buffer, format, values) {
	Steem.struct.pack(format, values).forEach(function(byte) {
		buffer.push(byte);
	});
}

__MODULE__ = SteemSerializer;

__MODULE__ = {
    "string" : {
        pack : function(buffer, value) {
            SteemSerializer.__pack_buffer(buffer, "B" + value.length + "s", [ value.length, value ]);
        },
        unpack : function(buffer) {

        }
    }, 
    "uint16" : {
        pack : function(buffer, value) {
            SteemSerializer.__pack_buffer(buffer, "<H", [ value ]);
        },
        unpack : function(buffer) {

        }
    }, 
    "int16" : {
        pack : function(buffer, value) {
            SteemSerializer.__pack_buffer(buffer, "<h", [ value ]);
        },
        unpack : function(buffer) {

        }
    },
    "unit32" : {
        pack : function(buffer, value) {
            SteemSerializer.__pack_buffer(buffer, "<I", [ value ]);
        },
        unpack : function(buffer) {

        }
    },
    "int32" : {
        pack : function(buffer, value) {
            SteemSerializer.__pack_buffer(buffer, "<i", [ value ]);
        },
        unpack : function(buffer) {

        }
    }, 
    "unit64" : {
        pack : function(buffer, value) {

        },
        unpack : function(buffer) {

        }
    }, 
    "int64" : {
        pack : function(buffer, value) {

        },
        unpack : function(buffer) {

        }
    },
    "public_key" : {
        pack : function(buffer, value) {
            SteemAuth.decode_public_key(value).forEach(function(byte) {
                SteemSerializer.__pack_buffer(buffer, "B", [ byte ]);
            });
        },
        unpack : function(buffer) {

        }
    },
    "asset" : {
        pack : function(buffer, value) {
            var tokens = value.split(" ");
            var amount = tokens[0].replace(".", ""); // * 1000
            var dot = tokens[0].indexOf("."); // 0.000
            var precision = (dot === -1) ? 0 : tokens[0].length - dot - 1;
            var symbol = tokens[1];

            SteemSerializer.__pack_buffer(buffer, "<I<I", [ parseInt(amount, 10), 0 ]);
            SteemSerializer.__pack_buffer(buffer, "B", [ precision ]);
            SteemSerializer.__pack_buffer(buffer, symbol.length + "s", [ symbol ]);

            for (var i = 0; i < 7 - symbol.length; i++) {
                SteemSerializer.__pack_buffer(buffer, "B", [ 0 ]);
            }
        },
        unpack : function(buffer) {

        }
    },
    "authority" : {
        pack : function(buffer, value) {
            SteemSerializer.__pack_buffer(buffer, "<I", [ value["weight_threshold"] ]);

            SteemSerializer.__pack_buffer(buffer, "B", [ value["account_auths"].length ]);
            value["account_auths"].forEach(function(auth) {
                // TBD
            });

            SteemSerializer.__pack_buffer(buffer, "B", [ value["key_auths"].length ]);
            value["key_auths"].forEach(function(auth) {
                SteemAuth.decode_public_key(auth[0]).forEach(function(byte) {
                    SteemSerializer.__pack_buffer(buffer, "B", [ byte ]);
                });
                SteemSerializer.__pack_buffer(buffer, "<H", [ auth[1] ]);
            });
        },
        unpack : function(buffer) {

        }
    },
    "array" : {
        pack : function(buffer, value, serializer) {
            SteemSerializer.__pack_buffer(buffer, "B", [ value.length ]);
            value.forEach(function(item) {
                //serializer.pack(buffer, item);
                SteemSerializer.__pack_buffer(buffer, "B" + item.length + "s", [ item.length, item ]);
            });
        },
        unpack : function(buffer) {

        }
    }
};

Books = (function() {
    return {};
})();

Books.open_book = function(author, permlink, url) {
    var item_id = author + "+" + permlink;
    var product_id = "P_" + item_id;

    controller.catalog().submit("product", null, product_id, {
        "items":[ item_id ]
    });

    controller.catalog().submit("item", null, item_id, {
        "type":"external",
        "download-url":url
    });
    
    controller.action("invoice", {
        "invoice-type":"product",
        "product":product_id,
        "receipt":Books.__build_receipt(author, permlink)
    });

    timeout(0.5, function() {
        controller.action("open", { "item":item_id });
    });
}

Books.__build_receipt = function(author, permlink) {
    return encode("base64", decode("string", JSON.stringify({
        "author":author, 
        "permlink":permlink
    })));
}

__MODULE__ = Books;

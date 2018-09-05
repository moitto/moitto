var books = require("books");

function open() {
    if (!books.has_valid_book($data["author"], $data["permlink"])) {
        books.generate_book($data["author"], $data["permlink"], function(response) {
            if (response) {
                books.open_book($data["author"], $data["permlink"]);
            }
        });
    } else {
        books.open_book($data["author"], $data["permlink"]);
    }
}

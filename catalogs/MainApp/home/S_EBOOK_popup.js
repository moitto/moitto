var books = require("books");

function open() {
    if (!books.has_valid_book($data["author"], $data["permlink"])) {
        books.generate_book($data["author"], $data["permlink"], function(response) {
            if (response) {
                books.open_book($data["author"], $data["permlink"]);
                controller.action("popup-close");
            }
        });

        __show_progress_section();
        __hide_ready_section();
        __disable_open_button();
    } else {
        books.open_book($data["author"], $data["permlink"]);
        controller.action("popup-close");
    }
}

function __show_progress_section() {
    var section = view.object("section.progress");

    section.action("show");
}

function __hide_ready_section() {
    var section = view.object("section.ready");

    section.action("hide");
}

function __disable_open_button() {
    var button = view.object("btn.open");

    button.property({ "enabled":"no" } );
}
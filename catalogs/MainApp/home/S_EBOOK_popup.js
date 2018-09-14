var books = require("books");

function open() {
    if (!books.has_valid_book($data["author"], $data["permlink"])) {
        books.generate_book($data["author"], $data["permlink"], function(response) {
            if (response) {
                books.open_book($data["author"], $data["permlink"]);

                controller.catalog().remove("showcase", "auxiliary", "S_EBOOK");
                controller.action("popup-close");
            } else {
                controller.action("toast", { "message":"전자책 변환에 실패했습니다."});

                __show_ready_section();
                __hide_progress_section();
                __enable_open_button();
            }
        });

        __hide_ready_section();
        __show_progress_section();
        __disable_open_button();
    } else {
        books.open_book($data["author"], $data["permlink"]);

        controller.catalog().remove("showcase", "auxiliary", "S_EBOOK");
        controller.action("popup-close");
    }
}

function close() {
    controller.action("popup-close");
}

function __show_progress_section() {
    var section = view.object("section.progress");

    section.action("show");
}

function __hide_progress_section() {
    var section = view.object("section.progress");

    section.action("hide");
}

function __show_ready_section() {
    var section = view.object("section.ready");

    section.action("show");
}

function __hide_ready_section() {
    var section = view.object("section.ready");

    section.action("hide");
}

function __enable_open_button() {
    var button = view.object("btn.open");

    button.property({ "enabled":"yes" } );
}

function __disable_open_button() {
    var button = view.object("btn.open");

    button.property({ "enabled":"no" } );
}

var __input_numbers = [];

function skip() {
    document.value("WALLET.PIN", "");

    host.action("script", { "script":$data["script"] });
}

function reset() {
    document.value("WALLET.PIN", "");

    host.action("script", { "script":$data["reset"] });
}

function press_number(params) {
    if (__input_numbers.length < 4) {
        __input_numbers.push(params["label"]);

        __update_number_labels();

        if (__input_numbers.length == 4) {
            __hide_numpad_section();
            __show_keypad_section();
        }
    }
}

function press_text(params) {
    if (__input_numbers.length == 4) {
        __input_numbers.push(params["label"]);

        document.value("WALLET.PIN", __input_numbers.join(""));
        __update_number_labels();

        timeout(0.1, function() {
            host.action("script", { "script":$data["script"] });
        });
    }
}

function press_back() {
    if (__input_numbers.length > 0) {
        __input_numbers.pop();

        __update_number_labels();

        if (__input_numbers.length == 3) {
            __show_numpad_section();
            __hide_keypad_section();
        }
    }
}

function __show_numpad_section() {
    var section = view.object("section.numpad");
   
    section.action("show");
}

function __hide_numpad_section() {
    var section = view.object("section.numpad");
   
    section.action("hide");
}

function __show_keypad_section() {
    var section = view.object("section.keypad");

    section.action("show");
}

function __hide_keypad_section() {
    var section = view.object("section.keypad");

    section.action("hide");
}

function __update_number_labels() {
    for (var i = 0; i < 5; ++i) {
        var label = view.object("label.number." + (i + 1));
        var visible = (i < __input_numbers.length) ? true : false;

        label.action(visible ? "show" : "hide");
    }
}

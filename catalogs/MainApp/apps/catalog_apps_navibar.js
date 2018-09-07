function edit_apps() {
    controller.action("script", {
        "script":"edit_apps",
        "subview":$data["SUBVIEW"],
        "close-popup":"yes"
    });

    __show_edit_section();
}

function edit_done() {
    controller.action("script", {
        "script":"edit_done",
        "subview":$data["SUBVIEW"]
    });

    __hide_edit_section();
}

function remove_apps() {
    controller.action("script", {
        "script":"remove_apps",
        "subview":$data["SUBVIEW"]
    });
}

function select_all() {
    controller.action("script", {
        "script":"select_all",
        "subview":$data["SUBVIEW"]
    });
}

function deselect_all() {
    controller.action("script", {
        "script":"deselect_all",
        "subview":$data["SUBVIEW"]
    });
}
 
function __show_edit_section() {
    var section = view.object("section.edit");

    section.action("show");    
}

function __hide_edit_section() {
    var section = view.object("section.edit");

    section.action("hide");    
}

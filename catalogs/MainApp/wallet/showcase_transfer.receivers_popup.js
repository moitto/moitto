var steemjs = require("steemjs");

function on_loaded() {
    __update_receivers();
}

function transfer(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", Object.assign(value, {
        "to":form["username"]
    }));

    controller.action("subview", { "subview":"V_TRANSFER", "target":"popup" });
}

function __update_receivers() {
    var me = storage.value("ACTIVE_USER");

    steemjs.get_following(me).then(function(following) {

    });
}

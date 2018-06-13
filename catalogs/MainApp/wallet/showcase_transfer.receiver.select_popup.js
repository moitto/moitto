var steemjs = require("steemjs");

function on_loaded() {
    __update_receivers();
}

function transfer(form) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");
    controller.catalog().submit("showcase", "auxiliary", "S_TRANSFER", Object.assign(value, {
        "to":form["username"],
        "fetched":"no"
    }));

    controller.action("popup", { 
        "display-unit":"S_TRANSFER", 
        "alternate-name":"transfer.receiver.verify"
    });
}

function __update_receivers() {
    var me = storage.value("ACTIVE_USER");

    steemjs.get_following(me).then(function(following) {

    });
}

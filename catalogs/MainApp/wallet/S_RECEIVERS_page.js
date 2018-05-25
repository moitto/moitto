var steemjs = require("steemjs");

function on_loaded() {
    __update_receivers();
}

function __update_receivers() {
    var username = storage.value("ACTIVE_USER");

    steemjs.get_following(username) {

    }
}


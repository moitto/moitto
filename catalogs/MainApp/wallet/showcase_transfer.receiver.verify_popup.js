var global = require("global");

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_TRANSFER");

    global.get_user(value["to"]).then(function(user) {
        var data = {
            "userpic-url":user.get_userpic_url(),
            "reputation":user.get_reputation().toFixed(1).toString(),
            "post-count":user.get_post_count().toString(),
            "following-count":user.get_following_count().toString(),
            "follower-count":user.get_follower_count().toString(),
            "steem-balance":user.get_steem_balance().toFixed(3).toString(),
            "steem-power":user.get_steem_power().toFixed(3).toString(),
            "sbd-balance":user.get_sbd_balance().toFixed(3).toString(),
            "fetched":"yes"
        };

        view.data("display-unit", data);
        view.action("reload");
    });
}

function transfer() {
    controller.action("subview", { 
        "subview":"V_TRANSFER", 
        "target":"popup",
        "close-popup":"yes"
    });
}

function cancel() {
    controller.action("popup", { 
        "display-unit":"S_TRANSFER", 
        "alternate-name":"transfer.receiver.select"
    });
}

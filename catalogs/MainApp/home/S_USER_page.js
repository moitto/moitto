var global = require("global");

function on_loaded() {
    var user = controller.catalog().value("showcase", "auxiliary", "S_USER");

    global.get_user(user["username"], function(user) {
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

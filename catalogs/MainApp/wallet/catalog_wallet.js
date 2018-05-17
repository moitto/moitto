var account = require("account");
var global  = require("global");

function on_loaded() {
    if (!account.is_logged_in()) {
        __hide_loading_section();
        __show_login_section();
        
        return;
    }

    global.get_user(account.username).then(function(user) {
        var catalog = controller.catalog();

        catalog.submit("showcase", "auxiliary", "S_WALLET.ACCOUNT", {
            "username":user.name,
            "reputation":user.get_reputation().toFixed(1).toString(),
            "post-count":user.get_post_count().toString(),
            "following-count":user.get_following_count().toString(),
            "follower-count":user.get_follower_count().toString()
        });

        catalog.submit("showcase", "auxiliary", "S_WALLET.ASSETS", {
            "steem-balance":user.get_steem_balance().toFixed(3).toString(),
            "steem-power":user.get_steem_power().toFixed(3).toString(),
            "sbd-balance":user.get_sbd_balance().toFixed(3).toString()
        });

        __reload_assets_showcase();
    });

    __hide_loading_section();
    __show_assets_showcase();
}

function feed_assets(keyword, location, length, sortkey, sortorder, handler) {
    var values = controller.catalog().value("showcase", "auxiliary", "S_WALLET.ASSETS");
    var assets = [
        {
            "id":"S_STEEM",
            "title":"STEEM",
            "amount":__safe_value(values, "steem-balance"),
            "has-own-title":"yes",
            "has-own-sbml":"yes"      
        },
        {
            "id":"S_STEEM_POWER",
            "title":"STEEM POWER",
            "amount":__safe_value(values, "steem-power"),
            "has-own-title":"yes",
            "has-own-sbml":"yes" 
        },
        {
            "id":"S_STEEM_DOLLAR",
            "title":"STEEM DOLLAR",
            "amount":__safe_value(values, "sbd-balance"),
            "has-own-title":"yes",
            "has-own-sbml":"yes" 
        }
    ];

    handler(assets);
}

function __reload_assets_showcase() {
    var showcase = view.object("showcase.assets");

    showcase.action("reload");
}

function __show_assets_showcase() {
    var showcase = view.object("showcase.assets");

    showcase.action("show");
}

function __show_login_section() {
    var section = view.object("section.login");

    section.action("show");
}

function __hide_loading_section() {
    var section = view.object("section.loading");

    section.action("hide");
}

function __calculate_reputation(reputation) {
    return (Math.log10(reputation) - 9) * 9 + 25;
}

function __safe_value(values, property) {
    if (values && values.hasOwnProperty(property)) {
        return values[property];
    }

    return "";
}

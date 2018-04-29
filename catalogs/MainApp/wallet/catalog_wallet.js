var account = require("account");

function on_loaded() {
	if (!account.is_logged_in()) {
        __hide_loading_section();
        __show_login_section();
        
		return;
	}

    account.update(function(data, follows, assets) {
        var catalog = controller.catalog();

    	catalog.submit("showcase", "auxiliary", "S_WALLET.ACCOUNT", {
            "username":account.username(),
    		"reputation":__calculate_reputation(data["reputation"]).toFixed(1),
    		"post-count":data["post_count"].toString(),
    		"following-count":follows["following_count"].toString(),
    		"follower-count":follows["follower_count"].toString()
    	});

        catalog.submit("showcase", "auxiliary", "S_WALLET.ASSETS", {
            "steem-balance":assets["steem_balance"].split(" ")[0],
            "steem-power":assets["steem_power"].split(" ")[0],
            "sbd-balance":assets["sbd_balance"].split(" ")[0]
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
			"title":"스팀",
            "amount":__safe_value(values, "steem-balance"),
            "has-own-title":"yes",
            "has-own-sbml":"yes"      
		},
		{
			"id":"S_STEEM_POWER",
			"title":"스팀파워",
            "amount":__safe_value(values, "steem-power"),
            "has-own-title":"yes",
            "has-own-sbml":"yes" 
		},
		{
			"id":"S_STEEM_DOLLAR",
			"title":"스팀달러",
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

function feed_assets(keyword, location, length, sortkey, sortorder, handler) {
	var assets = [
		{
			"id":"S_STEEM",
			"title":"STEEM",
            "has-own-title":"yes",
            "has-own-sbml":"yes"      
		},
		{
			"id":"S_STEEM_DOLLAR",
			"title":"STEEM DOLLARS",
            "has-own-title":"yes",
            "has-own-sbml":"yes" 
		},
		{
			"id":"S_STEEM_POWER",
			"title":"STEEM POWER",
            "has-own-title":"yes",
            "has-own-sbml":"yes" 
		}
	];

    handler(assets);
}

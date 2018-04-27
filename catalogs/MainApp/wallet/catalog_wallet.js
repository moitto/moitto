function feed_assets(keyword, location, length, sortkey, sortorder, handler) {
	var assets = [
		{
			"id":"S_STEEM_DOLLAR",
			"title":"스팀달러",
            "has-own-title":"yes",
            "has-own-sbml":"yes"      
		},
		{
			"id":"S_STEEM",
			"title":"스팀",
            "has-own-title":"yes",
            "has-own-sbml":"yes" 
		},
		{
			"id":"S_STEEM_POWER",
			"title":"스팀파워",
            "has-own-title":"yes",
            "has-own-sbml":"yes" 
		}
	];

    handler(assets);
}

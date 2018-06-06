var steemjs = require("steemjs");
var votes   = require("votes");

function feed_votes(keyword, location, length, sortkey, sortorder, handler) {
    var value = controller.catalog().value("showcase", "auxiliary", "S_VOTES");

    if (location == 0) {
        steemjs.get_active_votes(value["author"], value["permlink"]).then(function(response) {
            var data = [];

            response.forEach(function(entry) {
                console.log(JSON.stringify(entry));
                var vote = votes.create(entry);

                data.push({
                    "id":"S_VOTES_" + value["author"] + "_" + value["permlink"] + "_" + vote.data["voter"],
                    "voter":vote.data["voter"], 
                    "userpic-url":vote.get_userpic_url("small"),
                    "reputation":vote.get_reputation().toFixed(1).toString(),
                    "voted-at":vote.data["time"]
                });
            });

            handler(data);
        });                
    } else {
        handler();
    }
}

function show_user(data) {
    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":data["voter"],
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER" })
}

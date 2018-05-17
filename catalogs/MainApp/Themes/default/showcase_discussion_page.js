var connect = require("connect");

function on_loaded() {
    var referrer = [$data["author"], $data["permlink"]];
    var urls = __get_urls_in_content($data["body"]);

    urls.forEach(function(url) {
        if (connect.handle_url(url["url"], referrer)) {
            return;
        }
    })
}

function update_vote() {
    var voted = __is_voted();

    __update_vote_button(voted);
}

function show_votes() {
    controller.catalog().submit("showcase", "auxiliary", "S_VOTES", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });

    controller.action("page", { "display-unit":"S_VOTES", "target":"popup" })
}

function __update_vote_button(voted) {
    var button = view.object("btn.vote");

    button.property({
        "selected":voted ? "yes" : "no"
    });
}

function __is_voted() {
    var data = view.data("display-unit");

    if (data.hasOwnProperty("voted") && data["voted"] === "yes") {
        return true;
    }    

    return false;
}

function __get_urls_in_content(body) {
    var pattern = /\[([^\]]*)\]\(([^\)]+)\)/g;
    var matched = null;
    var urls = [];

    while (matched = pattern.exec(body)) {
        urls.push({
            "position":[ matched.index, pattern.lastIndex ],
            "alt":matched[1], 
            "url":matched[2]
        });
    }
    
    return urls;
}

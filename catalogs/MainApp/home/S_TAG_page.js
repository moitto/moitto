var global = require("global");

var __last_discussion = null;

function feed_blog(keyword, location, length, sortkey, sortorder, handler) {
    var start_author   = (location > 0) ? __last_discussion["author"]   : null;
    var start_permlink = (location > 0) ? __last_discussion["permlink"] : null;

    global.steemjs.get_discussions_by_hot($data["tag"], start_author, start_permlink, length).then(function(discussions) {
        var data = [];

        if (location > 0) {
            discussions = discussions.splice(1);
        }

        discussions.forEach(function(discussion) {
            var content   = global.contents.create(discussion);
 
            data.push({
                "id":"S_BLOG_" + content.data["author"] + "_" + content.data["permlink"],
                "author":content.data["author"],
                "permlink":content.data["permlink"],
                "title":content.data["title"], 
                "image-url":content.get_title_image_url("256x512"),
                "userpic-url":content.get_userpic_url("small"),
                "userpic-large-url":content.get_userpic_url(),
                "author-reputation":content.get_author_reputation().toFixed(0).toString(),
                "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                "votes-count":content.data["net_votes"].toString(),
                "main-tag":content.data["category"],
                "created-at":content.data["created"]
            });
        });

        if (discussions.length > 0) {
            __last_discussion = discussions[discussions.length - 1];
        }

        handler(data);
    });        
}

function open_discussion(data) {
    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION", {
        "author":data["author"],
        "permlink":data["permlink"],
        "userpic-url":data["userpic-url"]
    });
    
    controller.action("page", { "display-unit":"S_DISCUSSION" });
}

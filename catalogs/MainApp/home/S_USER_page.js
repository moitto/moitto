var global = require("global");

var __last_discussion = null;

function on_loaded() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_USER");

    global.get_user(value["username"]).then(function(user) {
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

function feed_blog(keyword, location, length, sortkey, sortorder, handler) {
    var start_author   = (location > 0) ? __last_discussion["author"]   : null;
    var start_permlink = (location > 0) ? __last_discussion["permlink"] : null;

    global.steemjs.get_discussions_by_blog($data["username"], start_author, start_permlink, length).then(function(discussions) {
        var data = [];

        if (location > 0) {
            discussions = discussions.splice(1);
        }

        discussions.forEach(function(discussion) {
            var content   = global.contents.create(discussion);
            var reblogged = (content.data["author"] !== $data["username"]) ? true : false;
 
            if (!reblogged) {
                var datum = {
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
                };

                datum = Object.assign(datum, __template_data_for_content(content));

                data.push(datum);
            }
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

function __template_data_for_content(content) {
    if (!content.meta["image"]) {
        return {
            "template":"text"
        }
    }

    return {};
}


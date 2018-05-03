var account = require("account");
var steemjs = require("steemjs");

var __last_discussion = null;
var __has_packages = true;

function on_loaded() {
    if (!account.is_logged_in()) {
        __show_login_section();
        
        return;
    }

    var packages = controller.module("packages");
    var has_packages = (packages.count() > 0) ? true : false;

    controller.catalog().submit("showcase", "auxiliary", "S_PACKAGES", {
        "has-packages":has_packages ? "yes" : "no"
    });

    if (has_packages != __has_packages) {
        __reload_feeds_header();
    }

    __has_packages = has_packages;
}

function on_resume() {
    var packages = controller.module("packages");
    var has_packages = (packages.count() > 0) ? true : false;

    controller.catalog().submit("showcase", "auxiliary", "S_PACKAGES", {
        "has-packages":has_packages ? "yes" : "no"
    });

    if (has_packages != __has_packages) {
        __reload_feeds_header();
    }

    __has_packages = has_packages;
}

function feed_feeds(keyword, location, length, sortkey, sortorder, handler) {
    var start_author   = (location > 0) ? __last_discussion["author"]   : null;
    var start_permlink = (location > 0) ? __last_discussion["permlink"] : null;

    if (account.is_logged_in()) {
        steemjs.get_discussions_by_feed(account.username(), length, start_author, start_permlink, function(discussions) {
            var data = [];

            if (location > 0) {
                discussions = discussions.splice(1);
            }

            discussions.forEach(function(discussion) {
                var image_url         = __get_image_url_in_discussion(discussion);
                var userpic_url       = __get_userpic_url_in_discussion(discussion);
                var userpic_large_url = __get_userpic_large_url_in_discussion(discussion);;
                var payout_value      = __get_payout_value_in_discussion(discussion).toFixed(2);

                data.push({
                    "id":"S_FEEDS_" + discussion["author"] + "_" + discussion["permlink"],
                    "author":discussion["author"],
                    "permlink":discussion["permlink"],
                    "title":discussion["title"], 
                    "image-url":image_url,
                    "userpic-url":userpic_url,
                    "userpic-large-url":userpic_large_url,
                    "payout-value":"$" + payout_value.toString(),
                    "votes-count":discussion["net_votes"].toString(),
                    "main-tag":discussion["category"],
                    "created-at":discussion["created"]
                });
            });

            if (discussions.length > 0) {
                __last_discussion = discussions[discussions.length - 1];
            }

            handler(data);
        });        
    } else {
        handler([]);
    }
}

function open_discussion(data) {
    controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION", {
        "author":data["author"],
        "permlink":data["permlink"],
        "userpic-url":data["userpic-url"]
    });
    
    controller.action("page", { "display-unit":"S_DISCUSSION" });
}

function __get_image_url_in_discussion(discussion) {
    var images = JSON.parse(discussion["json_metadata"])["image"];

    if (images && images.length > 0) {
          return "https://steemitimages.com/320x240/" + images[0];
    }

    return "";
}

function __get_userpic_url_in_discussion(discussion) {
    return "https://steemitimages.com/u/" + discussion["author"] + "/avatar/small";
}

function __get_userpic_large_url_in_discussion(discussion) {
    return "https://steemitimages.com/u/" + discussion["author"] + "/avatar";
}

function __get_payout_value_in_discussion(discussion) {
    var total_payout_value = parseFloat(discussion["total_payout_value"].replace("SBD", "").trim());
    
    if (total_payout_value > 0) {
        return total_payout_value;
    }
    
    return parseFloat(discussion["pending_payout_value"].replace("SBD", "").trim());
}

function __reload_feeds_header() {
    var showcase = view.object("showcase.feeds");

    showcase.action("reload-header");
}

function __show_login_section() {
    var section = view.object("section.login");

    section.action("show");
}


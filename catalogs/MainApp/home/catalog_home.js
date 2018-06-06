var account  = require("account");
var steemjs  = require("steemjs");
var contents = require("contents"); 

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
        steemjs.get_discussions_by_feed(account.username, start_author, start_permlink, length).then(function(discussions) {
            var data = [];

            if (location > 0) {
                discussions = discussions.splice(1);
            }

            discussions.forEach(function(discussion) {
                var content   = contents.create(discussion);
                var reblogged = (content.data["reblogged_by"].length > 0) ? true : false;

                data.push({
                    "id":"S_FEEDS_" + content.data["author"] + "_" + content.data["permlink"],
                    "author":content.data["author"],
                    "permlink":content.data["permlink"],
                    "title":content.data["title"], 
                    "image-url":content.get_title_image_url("256x512"),
                    "userpic-url":content.get_userpic_url("small"),
                    "userpic-large-url":content.get_userpic_url(),
                    "author-reputation":content.get_author_reputation().toFixed(0).toString(),
                    "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
                    "votes-count":content.data["net_votes"].toString(),
                    "replies-count":content.data["children"].toString(),
                    "main-tag":content.data["category"],
                    "reblogged":reblogged ? "yes" : "no",
                    "reblogged-by":reblogged ? content.data["reblogged_by"][0] : "",
                    "reblogged-count":content.data["reblogged_by"].length.toString(),
                    "reblogged-count-1":(content.data["reblogged_by"].length - 1).toString(),
                    "created-at":content.data["created"]
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

function __reload_feeds_header() {
    var showcase = view.object("showcase.feeds");

    showcase.action("reload-header");
}

function __show_login_section() {
    var section = view.object("section.login");

    section.action("show");
}


var steemjs  = require("steemjs");
var contents = require("contents");
var themes   = require("themes");
var safety   = require("safety");

var __disallowed_tags = safety.get_disallowed_tags();

function on_loaded() {
    var discussion = controller.catalog().value("showcase", "auxiliary", "S_DISCUSSION");
    
    //discussion["author"] = "radajin";
    //discussion["permlink"] = "2-condition-loop";

    __get_content(discussion["tag"], discussion["author"], discussion["permlink"], function(content) {
        var me = storage.value("ACTIVE_USER") || "";
        var tags = content.meta["tags"];
        var theme = __get_theme_in_tags(tags);
        var impl = themes.create(theme);
        var data = {
            "author":content.data["author"],
            "permlink":content.data["permlink"],
            "title":content.data["title"],
            "body":impl.build_body(content.data["body"], content.meta["format"], content.meta["image"]),
            "custom-text":impl.get_custom_text(),
            "image-url":content.get_title_image_url("256x512") || "",
            "large-image-url":content.get_title_image_url("640x480") || "",
            "userpic-url":content.get_userpic_url("small"),
            "userpic-large-url":content.get_userpic_url(),
            "author-reputation":content.get_author_reputation().toFixed(0).toString(),
            "votes-count":content.data["net_votes"].toString(),
            "vote-weight":(content.get_vote_weight(me) || content.get_vote_weight_after_payout(me)).toString(),
            "replies-count":content.data["children"].toString(),
            "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
            "payout-done":content.is_payout_done() ? "yes" : "no",
            "payout-declined":content.is_payout_declined() ? "yes" : "no",
            "editable":content.is_editable(me) ? "yes" : "no",
            "deletable":content.is_deletable(me) ? "yes" : "no",
            "hidable":(content.is_hidable(me) && !content.is_owner(me)) ? "yes" : "no",
            "main-tag":content.data["category"],
            "tag-1":(tags.length > 0) ? tags[0] : "",
            "tag-2":(tags.length > 1) ? tags[1] : "",
            "tag-3":(tags.length > 2) ? tags[2] : "",
            "tag-4":(tags.length > 3) ? tags[3] : "",
            "tag-5":(tags.length > 4) ? tags[4] : "",
            "tags":tags.join(","),
            "created-at":content.data["created"],
            "theme":impl.theme,
            "dir-path":impl.dir_path,
            "has-own-sbml":"no"
        };

        Object.keys(discussion).forEach(function(key) {
            if (key.startsWith("template") || key.startsWith("background")) {
                data[key] = discussion[key];
            }
        });

        if (!data.hasOwnProperty("background")) {
            data = Object.assign(data, __random_background_data());
        }

        if (impl.hides_navibar) {
            data["hides-navibar"] = "yes";
        }

        Object.keys(impl.auxiliary).forEach(function(key) {
            data[key] = impl.auxiliary[key];
        });

        controller.update("content-" + content.data["author"] + "." + content.data["permlink"], {
            "votes-count":content.data["net_votes"].toString(),
            "replies-count":content.data["children"].toString(),
            "vote-weight":content.get_vote_weight(me).toString(),
            "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
            "editable":content.is_editable(me) ? "yes" : "no",
            "deletable":content.is_deletable(me) ? "yes" : "no"
        });

        if (content.is_allowed(__disallowed_tags) && !content.is_banned()) {
            view.data("display-unit", data);
            view.data("environment", { "alternate-name":"discussion" });
            view.action("reload"); 
        } else {
            controller.action("toast", {
                "message":"허용되지 않는 컨텐츠입니다.",
                "close-popup":"yes"
            });
        }
    });
}

function __get_content(tag, author, permlink, handler) {
    var path = "/" + tag + "/@" + author + "/" + permlink;

    steemjs.get_state(path).then(function(response) {
        console.log(JSON.stringify(response));
        if (response) {
            var discussion = response["content"][author + "/" + permlink];
            console.log(discussion);
            var replies = [];

            Object.keys(response["content"]).forEach(function(path) {
                var content = response["content"][path];

                if (content["parent_permlink"] === permlink) {
                    replies.push(content);
                }
            });

            handler(contents.create(discussion, replies));
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    }); 
}

function __get_theme_in_tags(tags) {
    for (var i = 0; i < tags.length; ++i) {
        if (tags[i].startsWith("moitto-")) {
            var theme = tags[i].substring("moitto-".length);

            if ([ "playlist" ].includes(theme)) {
                return "moitto/" + theme;
            }

            continue;
        }

        if (tags[i].startsWith("tuubcast-")) {
            var theme = tags[i].substring("tuubcast-".length);

            if ([ "fancam" ].includes(theme)) {
                return "tuubcast/" + theme;
            }

            continue;
        }
    }

    return "default";
}

function __random_background_data() {
    var value = controller.catalog("StyleBank").values("showcase", "backgrounds", "C_COLOR", null, [ 0, 1 ], [ null, "random" ])[0];
    var data = { "background":value["id"] };

    Object.keys(value).forEach(function(key) {
        data["background." + key] = value[key];
    });

    return data;
}

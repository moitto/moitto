var global = require("global");
var themes = require("themes");

function on_loaded() {
    var discussion = controller.catalog().value("showcase", "auxiliary", "S_DISCUSSION");
    var username = storage.value("ACTIVE_USER");

    global.get_content(discussion["author"], discussion["permlink"], function(content) {
        var tags = content.meta["tags"];
        var theme = __get_theme_in_tags(tags);
        var impl = themes.create(theme);
 
        var data = {
            "author":content.data["author"],
            "permlink":content.data["permlink"],
            "userpic-url":content.get_userpic_url("small"),
            "title":content.data["title"],
            "body":impl.build_body(content.data["body"], content.meta["format"]),
            "votes-count":content.data["net_votes"].toString(),
            "replies-count":"0",
            "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
            "image-url":content.get_title_image_url("640x480"),
            "main-tag":content.data["category"],
            "tag-1":(tags.length > 0) ? tags[0] : "",
            "tag-2":(tags.length > 1) ? tags[1] : "",
            "tag-3":(tags.length > 2) ? tags[2] : "",
            "tag-4":(tags.length > 3) ? tags[3] : "",
            "tag-5":(tags.length > 4) ? tags[4] : "",
            "created-at":content.data["created"],
             "theme":impl.theme,
            "dir-path":impl.dir_path
        };

        if (impl.hides_navibar) {
            data["hides-navibar"] = "yes";
        }

        if (content.is_voted(username)) {
            data["voted"] = "yes"; 
        }

        view.data("display-unit", data);
        view.data("environment", { "alternate-name":"discussion" });
        view.action("reload");
    });
}

function __get_theme_in_tags(tags) {
    var theme = "default";

    tags.forEach(function(tag) {
        if (tag.startsWith("moitto-")) {
            theme = tag.substring("moitto-".length);
        }
    });

    return theme;
}

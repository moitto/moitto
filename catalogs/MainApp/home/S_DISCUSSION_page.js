var global = require("global");
var themes = require("themes");

function on_loaded() {
    var discussion = controller.catalog().value("showcase", "auxiliary", "S_DISCUSSION");
    var background = controller.catalog("ImageBank").value("showcase", "backgrounds", discussion["background"]);
    var me = storage.value("ACTIVE_USER");

    global.get_content(discussion["author"], discussion["permlink"]).then(function(content) {
        console.log(content.data["body"]);
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
            "replies-count":content.data["children"].toString(),
            "payout-value":"$" + content.get_payout_value().toFixed(2).toString(),
            "is-payout":content.is_payout() ? "yes" : "no",
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

        if (content.is_voted(me)) {
            data["voted"] = "yes"; 
        }

        if (impl.hides_navibar) {
            data["hides-navibar"] = "yes";
        }

        Object.keys(impl.auxiliary).forEach(function(key) {
            data[key] = impl.auxiliary[key];
        });

        if (background) {
            Object.keys(background).forEach(function(key) {
                data["background." + key] = background[key];
            });
        }
 
        view.data("display-unit", data);
        view.data("environment", { "alternate-name":"discussion" });
        view.action("reload");
    });
}

function __get_theme_in_tags(tags) {
    for (var i = 0; i < tags.length; ++i) {
        if (tags[i].startsWith("moitto-")) {
            var theme = tags[i].substring("moitto-".length);

            if ([ "playlist", "webtoon" ].includes(theme)) {
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

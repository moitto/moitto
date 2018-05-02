var steemjs = require("steemjs");

function on_loaded() {
	var discussion = document.value("DISCUSSION");

    steemjs.get_content(discussion["author"], discussion["permlink"], function(content) {
        var userpic_url = __get_userpic_url_in_discussion(discussion);
		var tags = JSON.parse(content["json_metadata"])["tags"];
 		var theme = __get_theme_in_tags(tags);
        var impl = include("~/Themes/" + theme + "/theme.js");

		var data = {
			"author":discussion["author"],
			"permlink":discussion["permlink"],
			"userpic-url":userpic_url,
			"title":content["title"],
			"body":impl.build_body(content.body),
			"votes-count":content["net_votes"].toString(),
			"replies-count":content["replies"].length.toString(),
			"main-tag":content["category"],
			"tag-1":(tags.length > 0) ? tags[0] : "",
			"tag-2":(tags.length > 1) ? tags[1] : "",
			"tag-3":(tags.length > 2) ? tags[2] : "",
			"tag-4":(tags.length > 3) ? tags[3] : "",
			"tag-5":(tags.length > 4) ? tags[4] : "",
			"created-at":content["created"],
			"theme":theme,
			"dir-path":"~/Themes/" + theme
		};

		if (impl.hides_navibar) {
			data["hides-navibar"] = "yes";
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

function __get_userpic_url_in_discussion(discussion) {
    return "https://steemitimages.com/u/" + discussion["author"] + "/avatar/small";
}

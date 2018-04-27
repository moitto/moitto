var steemjs = require("steemjs");

function on_loaded() {
	var discussion = document.value("DISCUSSION");

    steemjs.get_content(discussion["author"], discussion["permlink"], function(content) {
		var theme = __fetch_theme_in_content(content);
        var impl = include("~/Themes/" + theme + "/theme.js");
    
		var data = {
			"author":discussion["author"],
			"permlink":discussion["permlink"],
			"body":impl.build_body(content.body),
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

function __fetch_theme_in_content(content) {
	var meta = JSON.parse(content["json_metadata"]);
	var theme = "default";

	meta["tags"].forEach(function(tag) {
		if (tag.startsWith("moitto-")) {
			theme = tag.substring("moitto-".length);
		}
	});

	return theme;
}

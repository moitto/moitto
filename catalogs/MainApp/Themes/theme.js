include("./markdown.js");
include("./parser.js");
include("./renderer.js");

function ThemeBase() {
	this.hides_navibar = false;
}

ThemeBase.prototype.build_sbml = function(body) {
    var self = this;
	var sbml = "";

	var paragraphs = body.split(/\n\n+/);

	paragraphs.forEach(function(paragraph) {
		sbml += self.__build_paragraph(paragraph);
		sbml += "\n\n";
	});

	console.log(sbml);

	return sbml;
}

ThemeBase.prototype.__build_paragraph = function(paragraph) {
	var self = this;

	if (this.__is_horizontal_line(paragraph)) {
		return this.__build_horizontal_line();
	}

	var images = this.__search_images(paragraph);
	var has_whole_image = this.__has_whole_image(paragraph, images);

	images.reverse().forEach(function(image) {
		paragraph = self.__splice_string(
			paragraph, 
			image["position"][0], image["position"][1], 
			self.__build_image(image, !has_whole_image)
		);
	});

	var links = this.__search_links(paragraph);

	links.reverse().forEach(function(link) {
		paragraph = self.__splice_string(
			paragraph, 
			link["position"][0], link["position"][1], 
			self.__build_link(link)
		);
	});

	return paragraph;
}

ThemeBase.prototype.__search_images = function(text) {
	var pattern = /!\[([^\]]*)\]\(([^\)]+)\)/g;
	var matched = null;
	var images = [];

	while (matched = pattern.exec(text)) {
		images.push({
			"position":[ matched.index, pattern.lastIndex ],
			"alt":matched[1], 
			"url":matched[2]
		});
	}
    
    return images;
}

ThemeBase.prototype.__has_whole_image = function(text, images) {
	if (images.length == 0 || images.length > 1) {
		return false;
	}

	if (images[0]["position"][0] != 0) {
		return false;
	}

	if (images[0]["position"][1] != text.length) {
		return false;
	}

	return true;
}

ThemeBase.prototype.__build_image = function(image, inline) {
	var props = this.__build_props(this.__image_props(image));
	
	if (inline) {
		return "=(object image: style=image, " + props + ")=";
	}
	
	return "=object image: style=image.full, " + props;
}

ThemeBase.prototype.__image_props = function(image) {
	var props = {};

	props["image-url"] = image["url"];
	props["alt"]       = image["alt"];

	return props;
}

ThemeBase.prototype.__search_links = function(text) {
	var pattern = /\[([^\]]*)\]\(([^\)]+)\)/g;
	var matched = null;
	var links = [];

	while (matched = pattern.exec(text)) {
		links.push({
			"position":[ matched.index, pattern.lastIndex ],
			"text":matched[1], 
			"url":matched[2]
		});
	}
    
    return links;
}

ThemeBase.prototype.__build_link = function(link) {
	var text  = this.__escape_text(link["text"]);
	var props = this.__build_props(this.__link_props(link));

	return "=[link: " + props + "|" + text + "]=";
}

ThemeBase.prototype.__link_props = function(link) {
	var props = {};

	props["url"] = link["url"];

	return props;
}

ThemeBase.prototype.__build_horizontal_line = function() {
	return "=object blank: style=blank_line";
}

ThemeBase.prototype.__is_horizontal_line = function(text) {
	if (text.match(/(-\s?){2}(-\s?)+|(\*\s?){2}(\*\s?)+/g)) {
		return true;
	}

	return false;
}

ThemeBase.prototype.__build_inline_text = function(text) {
	text = text.replace(/\*\*(.+?)\*\*/g, "=[bold|" + this.__escape_text() + "]=");

	return text;
}

ThemeBase.prototype.__replace_markdown = function(text, pattern, builder) {
	var self = this;
	var matched = null;
	var matches = [];

	while (matched = pattern.exec(text)) {
		matches.push({
			"position":[ matched.index, pattern.lastIndex ],
			"replacement":builder(matched)
		});
	}
    
    matches.reverse().forEach(function(match) {
		text = self.__splice_string(
			paragraph, 
			link["position"][0], link["position"][1], 
			self.__build_link(link)
		);
	});

    return text;
}












ThemeBase.prototype.__build_props = function(props) {
	var sbml = "";

	for (var key in props) {
		if (sbml.length > 0) {
			sbml += ", ";
		}
		
		sbml += key + "=\"" + this.__escape_prop(props[key]) + "\"";
	}

	return sbml;
}

ThemeBase.prototype.__escape_text = function(text) {
	text = text.replace(/\|/g, "\\|");

	return text;
}

ThemeBase.prototype.__escape_prop = function(prop) {
	prop = prop.replace(/\"/g, "\\\"");

	return prop;
}

ThemeBase.prototype.__splice_string = function(string, start, end, replacement) {
    var head = string.substring(0, start);
    var body = string.substring(start, end);
    var tail = string.substring(end, string.length);

    return head + replacement + tail;
}

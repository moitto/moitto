Sbml = (function() {
    return {};
})();

Sbml.urls  = require("urls");
Sbml.texts = require("texts");

Sbml.generate_from_markdown = function(markdown, images) {
    var sbml =  Sbml.__elements_to_sbml(markdown.elements, images, false);

    console.log(JSON.stringify(images));
    console.log(sbml);

    return sbml;
}

Sbml.__elements_to_sbml = function(elements, images, inline) {
    var sbml = "";
    var center_begin_pos = 0;
    var center_ended = false;
    var inline_depth = 0;

    elements.forEach(function(element) {
        if (element.type === "text") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += Sbml.__handle_text(element.data["text"]);

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {
                sbml += Sbml.__handle_text(element.data["text"]);
            }

            return;
        }

        if (element.type === "break") {
            if (!element.data["inline"]) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }

            return;
        }

        if (element.type === "line") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n\n";
                sbml += "=(object blank: style=line)=";
                sbml += "\n\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }

            return;
        }

        if (element.type === "heading") {
            if (!element.data["inline"] && inline_depth == 0) {
                var has_center_tag = Sbml.__has_center_tag(element.data["elements"]);
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += has_center_tag ? "\n=begin center\n" : "";
                sbml += element.data["leadings"];
                sbml += "\n";
                sbml += "=begin heading-" + element.data["level"] + "\n";
                sbml += Sbml.__elements_to_sbml(element.data["elements"], images, true) + "\n";
                sbml += "=end heading-" + element.data["level"] + "\n";
                sbml += has_center_tag ? "\n=end center\n" : "";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }

            return;
        }

        if (element.type === "quote") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=begin quote\n";
                sbml += Sbml.__elements_to_sbml(element.data["elements"], images, false) + "\n";
                sbml += "=end quote\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {
                sbml += Sbml.__elements_to_sbml(element.data["elements"], images, true) + "\n";
                sbml += "\n";
            }

            return;
        }

        if (element.type === "code") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=begin code\n";
                sbml += element.data["text"] + "\n";
                sbml += "=end code\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {
                if (element.data.hasOwnProperty("elements")) {
                    sbml += "=[code|" + Sbml.__elements_to_sbml(element.data["elements"], images, true) + "]=";
                } else {
                    sbml += "=[code|" + element.data["text"] + "]=";
                }
            }

            return;
        }

        if (element.type === "list") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=begin list\n";
                element.data["items"].forEach(function(item) {
                    sbml += "=begin list-item: style=list-level-" + item[1] + "\n";
                    sbml += (item[0] || "•") + " " + Sbml.__elements_to_sbml(item[2], images, false) + "\n";
                    sbml += "=end list-item\n";
                });
                sbml += "=end list\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {
                element.data["items"].forEach(function(item) {
                    sbml += "\n";
                    sbml += (item[0] || "•") + " " + Sbml.__elements_to_sbml(item[2], images, true);
                });
                sbml += "\n";
            }

            return;
        }

        if (element.type === "table") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=begin table\n";
                sbml += "=begin tr: style=tr-header\n";
                element.data["headers"].forEach(function(elements) {
                    sbml += "=begin th\n";
                    sbml += Sbml.__elements_to_sbml(elements, images, false) + "\n";
                    sbml += "=end th\n";
                });
                sbml += "=end tr\n";

                var even = false;
                element.data["rows"].forEach(function(row) {
                    sbml += "=begin tr: style=" + (even ? "tr-even" : "tr-odd") + "\n";
                    row.forEach(function(elements) {
                        sbml += "=begin td: style=" + (even ? "td-even" : "td-odd") + "\n";
                        sbml += Sbml.__elements_to_sbml(elements, images, false) + "\n";
                        sbml += "=end td\n";
                    });
                    sbml += "=end tr\n";
                    even = even ? false : true;
                });
                sbml += "=end table\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }

            return;
        }

        if (element.type === "h-tag-begin") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=begin heading-" + element.data["level"] + "\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }

            return;
        }

        if (element.type === "h-tag-end") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=end heading-" + element.data["level"] + "\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }
 
            return;
        }

        if (element.type === "div-tag-begin") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=begin div: style=\"" + (element.data["class"] || "") + "\"\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }

            return;
        }

        if (element.type === "div-tag-end") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=end div\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }
 
            return;
        }

        if (element.type === "blockquote-tag-begin") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=begin quote: style=\"" + (element.data["class"] || "") + "\"\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }

            return;
        }

        if (element.type === "blockquote-tag-end") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=end quote\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }
 
            return;
        }

        if (element.type === "center-tag-begin") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml = sbml.substr(0, center_begin_pos) + "\n=begin center\n" + sbml.substr(center_begin_pos);

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }

            return;
        }
 
        if (element.type === "center-tag-end") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";

                center_begin_pos = sbml.length;
                center_ended = true;
            } else {

            }

            return;
        }

        if (element.type === "pre-tag-begin") {

            return;
        }

        if (element.type === "pre-tag-end") {

            return;
        }

        if (["table", "tr", "th", "td"].includes(element.type.replace("-tag-begin", ""))) {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=begin " + element.type.replace("-tag-begin", "") + "\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }

            return;
        }

        if (["table", "tr", "th", "td"].includes(element.type.replace("-tag-end", ""))) {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=end " + element.type.replace("-tag-end", "") + "\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }
 
            return;
        }

        if (element.type === "br-tag") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += (sbml.length > 0 && sbml[sbml.length - 1] != "\n") ? "\n" : "";
                sbml += "=[br|]=\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {
                sbml += (sbml.length > 0 && sbml[sbml.length - 1] != "\n") ? "\n" : "";
                sbml += "=[br|]=\n";
            }

            return;
        }

        if (element.type === "hr-tag") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n\n";
                sbml += "=(object blank: style=line)=";
                sbml += "\n\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {

            }

            return;
        }

        if (element.type === "image") {
            sbml += "=(object image: style=image, image-url=\"" + Sbml.__url_for_image(element.data["url"]) + "\")=";

            return;
        }

        if (element.type === "image-tag") {
            sbml += "=(object image: style=image, image-url=\"" + Sbml.__url_for_image(element.data["url"]) + "\")=";

            return;
        }

        if (element.type === "link-begin") {
            sbml += "=[link: script=open_url, url=\"" + element.data["url"] + "\"|";
            inline_depth = inline_depth + 1;

            return;
        }

        if (element.type === "link-end") {
            sbml += "]=";
            inline_depth = inline_depth - 1;

            return;
        }

        if (element.type === "anchor-tag") {
            sbml += "=[link: script=open_url, url=\"" + element.data["url"] + "\"|" + Sbml.__elements_to_sbml(element.data["elements"], images, true) + "]=";

            return;
        }

        if (element.type === "url") {
            var youtube_video_id = Sbml.urls.get_youtube_video_id(element.data["url"]);

            if (youtube_video_id) {
                sbml += "=(object youtube: style=youtube, video-id=\"" + youtube_video_id + "\")=";

                return;
            }

            if (Sbml.__is_image_url((images || []), element.data["url"]) || Sbml.__is_image_path(element.data["path"] || "")) {
                sbml += "=(object image: style=image, image-url=\"" + Sbml.__url_for_image(element.data["url"]) + "\")=";

                return;
            }

            sbml += "=[link: script=open_url, url=\"" + element.data["url"] + "\"|" + element.data["url"] + "]=";

            return;
        }

        if (["italic", "em", "em-italic", "linethrough"].includes(element.type.replace("-begin", ""))) {
            sbml += element.data["prior"] + "=[" + element.type.replace("-begin", "") + "|";
            inline_depth = inline_depth + 1;

            return;
        }

        if (["italic", "em", "em-italic", "linethrough"].includes(element.type.replace("-end", ""))) {
            sbml += "]=" + element.data["trailing"];
            inline_depth = inline_depth - 1;

            return;
        }

        if (["strong", "strike", "bold", "italic", "code", "sub", "sup"].includes(element.type.replace("-tag-begin", ""))) {
            sbml += "=[" + element.type.replace("-tag-begin", "") + "|";
            inline_depth = inline_depth + 1;

            return;
        }

        if (["strong", "strike", "bold", "italic", "code", "sub", "sup"].includes(element.type.replace("-tag-end", ""))) {
            sbml += "]=";
            inline_depth = inline_depth - 1;

            return;
        }
    });

    sbml += center_ended ? "\n=end center\n" : "";

    sbml = sbml.replace(/\n\n+/g, "\n\n");

    return sbml;
}

Sbml.__has_center_tag = function(elements) {
    for (var i = 0; i < elements.length; ++i) {
        if (elements[i].type === "center-tag-begin") {
            return true;
        }
    }

    return false;
}

Sbml.__handle_text = function(text) {
    text = text.replace(/\\/g, "").replace(/(\[|\]|=|\(|\))/g, "\\$1");
    text = text.replace(/(^|\s+)@([a-z0-9\-]+(?:\.[a-z0-9\-]+)*)/g, "$1=[user:username=\"$2\"|@$2]=");
    text = text.replace(/[ \t][ \t]+/g, " ");
    text = Sbml.texts.replace_emoji_chars(text, "=[emoji|$1]=");
    text = decode("html", text);

    return text;
}

Sbml.__is_image_url = function(images, url) {
    for (var index = 0; index < images.length; index++) {
        if (url.includes(images[index])) {
            return true;
        }
    }

    return false;
}

Sbml.__is_image_path = function(path) {
    if (path.match(/\.(jpg|jpeg|png|gif)(\?|\/|$)/ig)) {
        return true;
    }

    return false;
}

Sbml.__url_for_image = function(url, size) {
    return "https://cdn.steemitimages.com/" + (size || "640x0") + "/" + url;
}

__MODULE__ = Sbml;

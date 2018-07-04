Sbml = (function() {
    return {};
})();

Sbml.media = require("media");
Sbml.texts = require("texts");

Sbml.generate_from_markdown = function(markdown) {
    var sbml =  Sbml.__elements_to_sbml(markdown.elements, false);

    console.log(sbml);

    return sbml;
}

Sbml.__elements_to_sbml = function(elements, inline) {
    var sbml = "";
    var center_begin_pos = 0;
    var center_ended = false;
    var inline_depth = 0;

    elements.forEach(function(element) {
        if (element.type === "text") {
            sbml += Sbml.__handle_text(element.data["text"]);

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

        if (element.type === "br-tag") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n=[br| ]=\n";

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

        if (element.type === "line" || element.type === "hr-tag") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=(object blank: style=line)=";
                sbml += "\n";

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
                sbml += Sbml.__elements_to_sbml(element.data["elements"], true) + "\n";
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
                element.data["items"].forEach(function(elements) {
                    sbml += Sbml.__elements_to_sbml(elements, false);
                    sbml += "\n";
                });
                sbml += "=end quote\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {
                element.data["items"].forEach(function(elements) {
                    sbml += "\n";
                    sbml += Sbml.__elements_to_sbml(elements, true);
                });
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
               sbml += "=[code|" + Sbml.__elements_to_sbml(element.data["elements"], true) + "]=";
            }

            return;
        }

        if (element.type === "list") {
            if (!element.data["inline"] && inline_depth == 0) {
                sbml += center_ended ? "\n=end center\n" : "";
                sbml += "\n";
                sbml += "=begin list\n";
                element.data["items"].forEach(function(elements) {
                    sbml += Sbml.__elements_to_sbml(elements, false);
                    sbml += "\n";
                });
                sbml += "=end list\n";

                center_begin_pos = sbml.length;
                center_ended = false;
            } else {
                element.data["items"].forEach(function(elements) {
                    sbml += "\n";
                    sbml += Sbml.__elements_to_sbml(elements, true);
                });
                sbml += "\n";
            }

            return;
        }

        if (element.type === "bullet") {
            sbml += (element.data["symbol"] || "•") + " "

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
            sbml += "=[link: script=open_url, url=\"" + element.data["url"] + "\"|" + Sbml.__elements_to_sbml(element.data["elements"], true) + "]=";

            return;
        }

        if (element.type === "url") {
            var youtube_video_id = Sbml.media.get_youtube_video_id(element.data["url"]);

            if (youtube_video_id) {
                sbml += "=(object youtube: style=youtube, video-id=\"" + youtube_video_id + "\")=";

                return;
            }

            if ((element.data["path"] || "").search(/\.(jpg|jpeg|png|gif)(\?|\/|$)/ig) != -1) {
                sbml += "=(object image: style=image, image-url=\"" + Sbml.__url_for_image(element.data["url"]) + "\")=";

                return;
            }

            sbml += "=[link: script=open_url, url=\"" + element.data["url"] + "\"|" + element.data["url"] + "]=";

            return;
        }

        if (["italic", "em", "em-italic", "linethrough"].includes(element.type.replace("-begin", ""))) {
            sbml += "=[" + element.type.replace("-begin", "") + "|";
            inline_depth = inline_depth + 1;

            return;
        }

        if (["italic", "em", "em-italic", "linethrough"].includes(element.type.replace("-end", ""))) {
            sbml += "]=";
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
    text = text.replace(/(^|\s+)@([a-z0-9\-]+(?:\.[a-z0-9\-]+)*)/g, "$1=[user:username=\"$2\"|@$2]=");
    text = Sbml.texts.replace_emoji_chars(text, "=[emoji|$1]=");
    text = decode("html", text);

    return text;
}

Sbml.__url_for_image = function(url, size) {
    return "https://cdn.steemitimages.com/" + (size || "640x0") + "/" + url;
}

__MODULE__ = Sbml;

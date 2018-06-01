Sbml = (function() {
    return {};
})();

Sbml.generate_from_markdown = function(markdown) {
    return Sbml.__elements_to_sbml(markdown.elements);
}

Sbml.__elements_to_sbml = function(elements) {
    var sbml = "";

    elements.forEach(function(element) {
        if (element.type === "text") {
            sbml += Sbml.__handle_text(element.data["text"]);

            return;
        }

        if (element.type === "break") {
            sbml += "\n\n";

            return;
        }

        if (element.type === "div-tag-begin") {
            sbml += "\n";
            sbml += "=begin div: style=\"" + (element.data["class"] || "") + "\"\n";

            return;
        }

        if (element.type === "div-tag-end") {
            sbml += "\n";
            sbml += "=end div\n";

            return;
        }

        if (element.type === "br-tag") {
            sbml += "\n=[br| ]=\n";

            return;
        }

        if (element.type === "line" || element.type === "hr-tag") {
            sbml += "\n";
            sbml += "=(object blank: style=line)=";
            sbml += "\n";

            return;
        }

        if (element.type === "heading") {
            sbml += element.data["leadings"];
            sbml += "=[heading-" + element.data["level"] + "|" + Sbml.__elements_to_sbml(element.data["elements"]) + "]=";
            sbml += "\n";

            return;
        }

        if (element.type === "quote") {
            if (!element.data["inline"]) {
                sbml += "\n";
                sbml += "=begin quote\n";
                element.data["items"].forEach(function(elements) {
                    sbml += Sbml.__elements_to_sbml(elements);
                    sbml += "\n";
                });
                sbml += "=end quote\n";
            } else {
                element.data["items"].forEach(function(elements) {
                    sbml += "\n";
                    sbml += Sbml.__elements_to_sbml(elements);
                });
                sbml += "\n";
            }

            return;
        }

        if (element.type === "code") {
            sbml += "\n";
            sbml += "=begin code\n";
            sbml += element.data["text"] + "\n";
            sbml += "=end code\n";

            return;
        }

        if (element.type === "inline-code") {
            sbml += "=[code|" + Sbml.__elements_to_sbml(element.data["elements"]) + "]=";

            return;
        }

        if (element.type === "list") {
            if (!element.data["inline"]) {
                sbml += "\n";
                sbml += "=begin list\n";
                element.data["items"].forEach(function(elements) {
                    sbml += Sbml.__elements_to_sbml(elements);
                    sbml += "\n";
                });
                sbml += "=end list\n";
            } else {
                element.data["items"].forEach(function(elements) {
                    sbml += "\n";
                    sbml += Sbml.__elements_to_sbml(elements);
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

            return;
        }

        if (element.type === "link-end") {
            sbml += "]=";

            return;
        }

        if (element.type === "anchor-tag") {
            sbml += "=[link: script=open_url, url=\"" + element.data["url"] + "\"|" + Sbml.__elements_to_sbml(element.data["elements"]) + "]=";

            return;
        }

        if (element.type === "url") {
            var youtube = /https?:\/\/youtu\.be\/([^?]+)(?:\?.+)?/.exec(element.data["url"]);

            if (!youtube) {
                youtube = /https?:\/\/.*youtube\.com\/.*\?.*v=([^&]+).*/.exec(element.data["url"]);
            }

            if (youtube) {
                sbml += "\n";
                sbml += "=(object youtube: style=youtube, video-id=\"" + youtube[1] + "\")=";

                return;
            }

            if ((element.data["path"] || "").search(/\.(jpg|jpeg|png|gif)(\?|\/|$)/ig) != -1) {
                sbml += "\n";
                sbml += "=(object image: style=image, image-url=\"" + Sbml.__url_for_image(element.data["url"]) + "\")=";

                return;
            }

            sbml += "\n";
            sbml += "=[link: script=open_url, url=\"" + element.data["url"] + "\"|" + element.data["url"] + "]=";

            return;
        }

        if (["italic", "em", "em-italic", "linethrough"].includes(element.type.replace("-begin", ""))) {
            sbml += "=[" + element.type.replace("-begin", "") + "|";

            return;
        }

        if (["italic", "em", "em-italic", "linethrough"].includes(element.type.replace("-end", ""))) {
            sbml += "]=";

            return;
        }

        if (["strong", "bold", "italic", "code", "sub", "sup"].includes(element.type.replace("-tag", ""))) {
            sbml += "=[" + element.type.replace("-tag", "") + "|" + Sbml.__elements_to_sbml(element.data["elements"]) + "]=";

            return;
        }
    });

    return sbml;
}

Sbml.__handle_text = function(text) {
    text = text.replace(/@([a-z0-9\-]+)/g, "=[user:username=\"$1\"|@$1]=");
    text = decode("html", text);

    return text;
}

Sbml.__url_for_image = function(url, size) {
    return "https://cdn.steemitimages.com/" + (size || "640x480") + "/" + url;
}

__MODULE__ = Sbml;

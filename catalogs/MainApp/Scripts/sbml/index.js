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
            sbml += Sbml.__html_to_sbml(element.data["text"]);

            return;
        }

        if (element.type === "break") {
            sbml += "\n\n";

            return;
        }

        if (element.type === "line") {
            sbml += "\n";
            sbml += "=(object blank: style=line)=";
            sbml += "\n";

            return;
        }

        if (element.type === "heading") {
            if (sbml.length > 0) {
                sbml += "\n";
            }

            sbml += "=[heading-" + element.data["level"] + "|" + Sbml.__elements_to_sbml(element.data["elements"]) + "]=";
            sbml += "\n";

            return;
        }

        if (element.type === "image") {
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

        if (["italic-begin", "em-begin", "em-italic-begin", "linethrough-begin"].includes(element.type)) {
            sbml += "=[" + element.type.replace("-begin", "") + "|";

            return;
        }

        if (["italic-end", "em-end", "em-italic-end", "linethrough-end"].includes(element.type)) {
           sbml += "]=";

            return;
        }
    });

    console.log(sbml);

    return sbml;
}

Sbml.__html_to_sbml = function(text) {
    text = decode("html", text);

    return text;
}

Sbml.__url_for_image = function(url, size) {
    return "https://cdn.steemitimages.com/" + (size || "640x480") + "/" + url;
}

__MODULE__ = Sbml;

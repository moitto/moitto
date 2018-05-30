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
            sbml += element.data["text"];

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

    sbml = Sbml.__handle_html_tags(sbml);
    sbml = decode("html", sbml);

    console.log(sbml);

    return sbml;
}

Sbml.__handle_html_tags = function(text) {
    var tokenizer = /(<\/?br[^>]+>)|(?:<(sub|sup)>)|(?:<\/(sub|sup)>)/ig;
    var token, handled_text = "";
    var last_index  = 0;

    while ((token = tokenizer.exec(text))) {
        handled_text += text.substring(last_index, token.index);
    
        if (token[1]) { // br
            handled_text += "\n=[br| ]=\n";
        } else if (token[2]) { // start of sub, sup
            handled_text += "=[" + token[2] + "|";
        } else if (token[3]) { // end of sub, sup
            handled_text += "]=";
        }

        last_index = tokenizer.lastIndex;
    }

    handled_text += text.substring(last_index, text.length);

    return handled_text;
}

Sbml.__process_center_tags = function(text) {


    return text;
}

Sbml.__url_for_image = function(url, size) {
    return "https://cdn.steemitimages.com/" + (size || "640x480") + "/" + url;
}

__MODULE__ = Sbml;

Sbml = (function() {
    return {};
})();

Sbml.generate_from_markdown = function(markdown) {
    var sbml = "";

    markdown.elements.forEach(function(element) {
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

            sbml += "=[heading-" + element.data["level"] + "|" + Sbml.__html_to_sbml(element.data["text"]) + "]=";
            sbml += "\n";

            return;
        }

        if (element.type === "image") {
            sbml += "=(object image: style=image, image-url=\"" + element.data["url"] + "\")=";

            return;
        }


        if (element.type === "link-begin") {
            sbml += "=[link:url=\"" + element.data["url"] + "\"|";

            return;
        }

        if (element.type === "link-end") {
            sbml += "]=";

            return;
        }

        if (element.type === "url") {
            if (element.data["path"].search(/\.[jpg|jpeg|png|gif](\?|\/|$)/ig) != -1) {
                sbml += "\n";
                sbml += "=(object image: style=image, image-url=\"" + element.data["url"] + "\")=";

                return;
            }

            sbml += "\n";
            sbml += "=[link:url=\"" + element.data["url"] + "\"|" + element.data["url"] + "]=";

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

__MODULE__ = Sbml;

MarkdownParser = (function() {
    return {};
})();

MarkdownParser.parse = function(text) {
    console.log(text);
    var tokenizer = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^```(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)>\s+.*)+)|((?:(?:^|\n)(?:[*+-]|\d+\.)\s+.*)+)|(?:\!\[([^\]]*?)\]\(([^\)]+?)\))|(\[)|(\](?:\(([^\)]+?)\))?)|(?:(?:^|\n)(#{1,5})(?:\n+|$))|(?:(?:^|\n)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|\*{1,3}|_{1,3}|~{2})/gm;
    var elements = [];
    var token, text_chunk, chunk, element;
    var last_index  = 0;

    while ((token = tokenizer.exec(text))) {
        text_chunk = text.substring(last_index, token.index);
        chunk = token[0];

        if (token[3] || token[4]) { // code/indent block
            element = {
                type:"code",
                data:{
                    text:MarkdownParser.__outdent(token[3] || token[4]).replace(/^\n+|\n+$/g, '')
                }
            }
        } else if (token[5]) { // > quote
            var lines = [];
            token[5].trim().split("\n").forEach(function(line) {
                lines.push(MarkdownParser.parse(line.replace(/^[>]\s+/gm, "")));
            });
            element = {
                type:"quote",
                data:{
                    lines:lines
                }
            }

            MarkdownParser.__clear_unhandled_begins(elements);
        } else if (token[6]) { // -* list
            var lines = [];
            token[6].trim().split("\n").forEach(function(line) {
                lines.push(MarkdownParser.parse(line.replace(/^([*+-]|\d+\.)\s+/gm, "")));
            });
            element = {
                type:"list",
                data:{
                    lines:lines
                }
            }

            MarkdownParser.__clear_unhandled_begins(elements);
        } else if (token[8]) { // image
            element = {
                type:"image",
                data:{
                    url:token[8],
                    alt:token[7]
                }
            }
        } else if (token[9]) { // begin of link
            element = {
                type:"link-begin-or-text",
                data:{
                    text:token[9] // "["
                }
            }     
        } else if (token[10]) { // end of link
            var link_begin_or_text = MarkdownParser.__last_link_begin_or_text(elements);

            if (token[11] && link_begin_or_text) { // link
                link_begin_or_text["type"] = "link-begin";
                link_begin_or_text.data["url"] = token[11];

                element = {
                    type:"link-end",
                    data:{
                        url:token[11]
                    }
                }
            } else {
                if (link_begin_or_text) {
                    link_begin_or_text["type"] = "text";
                }

                element = {
                    type:"text",
                    data:{
                        text:token[10] // "]"
                    }
                }
            }
        } else if (token[12] || token[13]) { // headings
            element = {
                type:"heading",
                data:{
                    text:token[13] ? token[14] : "",
                    level:(token[12] || token[13]).length
                }
            }
        } else if (token[15]) { // `code`
            element = {
                type:"code",
                data:{
                    text:token[15]
                }
            }
        } else if (token[16] || token[1]) { // inline formatting: *em*, **strong**, ...
            var symbol = token[16] ? token[16][0] : "";

            if (symbol === "*" || symbol === "_" || symbol === "~") {
                var formatter_begin = MarkdownParser.__last_formatter_begin(elements, symbol);

                if (formatter_begin) {
                    var length = Math.min(formatter_begin.data["text"].length, token[16].length);
                    var type = (symbol === "~") ? "linethrough" : (length == 3) ? "em-italic" : (length == 2) ? "em" : "italic";

                    formatter_begin["type"] = type + "-begin";
                    formatter_begin.data["prior"] = formatter_begin.data["text"].substring(0, token[16].length - length);

                    element = {
                        type:type + "-end",
                        data:{
                            trailing:token[16].substring(0, formatter_begin.data["text"].length - length)
                        }
                    }
                } else {
                   element = {
                        type:"formatter-begin",
                        data:{
                            text:token[16]
                        }
                    }
                }
            } else {
                element = {
                    type:"break",
                    data:{
                        text:token[16] || token[1]
                    }
                }

                MarkdownParser.__clear_unhandled_begins(elements);
            }
        }

        if (text_chunk.length > 0) {
            elements.push({
                type:"text",
                data:{
                    text:text_chunk
                }
            });
        }

        elements.push(element);

        last_index = tokenizer.lastIndex;
    }

    text_chunk = text.substring(last_index, text.length);
    
    if (text_chunk.length > 0) {
        elements.push({
            type:"text",
            data:{
                text:text_chunk
            }
        });
    }

    MarkdownParser.__clear_unhandled_begins(elements);

    elements.forEach(function(element) {
        console.log(JSON.stringify(element));
        console.log("<<<<<<<<<");
    });

    return elements;
}

MarkdownParser.__outdent = function(str) {
    return str.replace(RegExp('^'+(str.match(/^(\t| )+/) || '')[0], 'gm'), '');
}

MarkdownParser.__last_link_begin_or_text = function(elements) {
    if (elements.length > 0) {
        for (var i = elements.length - 1; i >= 0; i--) {
            if (elements[i].type === "link-begin-or-text") {
                return elements[i];
            }
        }
    }
}

MarkdownParser.__last_formatter_begin = function(elements, symbol) {
    if (elements.length > 0) {
        for (var i = elements.length - 1; i >= 0; i--) {
            if (elements[i].type === "formatter-begin") {
                if (elements[i].data["text"][0] === symbol) {
                    return elements[i];
                }
            }
        }
    }
}

MarkdownParser.__clear_unhandled_begins = function(elements) {
   elements.forEach(function(element) {
       if (["link-begin-or-text", "formatter-begin"].includes(element.type)) {
           element["type"] = "text";

           return;
       }
   });
}

__MODULE__ = MarkdownParser;

MarkdownParser = (function() {
    return {};
})();

MarkdownParser.parse = function(text) {
    console.log(text);
    text = MarkdownParser.__handle_html_tags(text);
    console.log(text);

    return MarkdownParser.__parse_to_markdown(text);
}

MarkdownParser.__parse_to_markdown = function(text) {
    var tokenizer = /((?:^|\n+)(?:---+|- -(?: -)+|\* \*(?: \*)+)\n*)|(?:(?:^|\n)```(\w*)\n([\s\S]*?)```(?:\n+|$))|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)>[^\n]*)(?:\n(?:(?:>[^\n]*)|(?:[^\n]+)))*)|((?:(?:^|\n)(?:[*+-]|\d+\.)\s+.*)+)|(?:\!\[([^\]]*?)\]\(([^\s]+?)\))|(\[)|(\](?:\(([^\s]+?)\))?)|(?:(?:^|\n)(#{1,6})(?:\n+|$))|(?:(?:^|\n)(#{1,6})\s*(.+)(?:\n+|$))|((?:https?:\/\/)((?:[a-z0-9\-]+\.?)+)((?:\/[a-zA-Z0-9_@%:\/\.\-]+)|\/)?(?:(?:\?[^\s]+)|(?:\#[^\s]+))?)|(?:`([^`]*)`)|(  \n\n*|\n{2,}|\*{1,3}|_{1,3}|~{2})/gm;
    var elements = [];
    var token, text_chunk, chunk, element;
    var last_index  = 0;

    while ((token = tokenizer.exec(text))) {
        text_chunk = text.substring(last_index, token.index);
        chunk = token[0];

        if (token[1]) { // line
            element = {
                type:"line",
                data:{
                    /* no data */
                }
            }
        } else if (token[3] || token[4]) { // code/indent block
            element = {
                type:"code",
                data:{
                    text:MarkdownParser.__outdent(token[3] || token[4]).replace(/^\n+|\n+$/g, '')
                }
            }
        } else if (token[5]) { // > quote
            var lines = [];
            token[5].trim().split("\n").forEach(function(line) {
                lines.push(MarkdownParser.parse(line.replace(/^>\s*/gm, "")));
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
                var elements = MarkdownParser.parse(line.replace(/^([*+-]|\d+\.)\s+/g, ""));

                elements.splice(0, 0, {
                    type:"bullet",
                    data:{
                        symbol:line.match(/^([*+-]|(\d+\.))\s+.*/)[2] || ""
                    }
                });

                lines.push(elements);
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
                    elements:MarkdownParser.parse(token[13] ? token[14].replace(/\s+#+$/, "") : ""),
                    level:(token[12] || token[13]).length,
                    leadings:(token.index > 0) ? "\n" : ""
                }
            }
        } else if (token[15]) { // url
            element = {
                type:"url",
                data:{
                    url:token[15],
                    host:token[16],
                    path:token[17]
                }
            }
        } else if (token[18]) { // `code`
            element = {
                type:"inline-code",
                data:{
                    elements:MarkdownParser.parse(token[18])
                }
            }
        } else if (token[19]) { // inline formatting: *em*, **strong**, ...
            var symbol = token[19] ? token[19][0] : "";

            if (symbol === "*" || symbol === "_" || symbol === "~") {
                var formatter_begin = MarkdownParser.__last_formatter_begin(elements, symbol);

                if (formatter_begin) {
                    var length = Math.min(formatter_begin.data["text"].length, token[19].length);
                    var type = (symbol === "~") ? "linethrough" : (length == 3) ? "em-italic" : (length == 2) ? "em" : "italic";

                    formatter_begin["type"] = type + "-begin";
                    formatter_begin.data["prior"] = formatter_begin.data["text"].substring(0, token[19].length - length);

                    element = {
                        type:type + "-end",
                        data:{
                            trailing:token[19].substring(0, formatter_begin.data["text"].length - length)
                        }
                    }
                } else {
                   element = {
                        type:"formatter-begin",
                        data:{
                            text:token[19]
                        }
                    }
                }
            } else {
                element = {
                    type:"break",
                    data:{
                        text:token[19]
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
        console.log(JSON.stringify(element));
        console.log("-------");

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

    console.log("DONE");

    return elements;
}

MarkdownParser.__handle_html_tags = function(text) {
    var tokenizer = /(?:<a[^>]*href=\"([^"]+)\"[^>]*>)|(<\/a>)|(?:<img[^>]*src=\"([^"]+)\"[^>]*\/?>(?:<\/img>)?)|(<\/?(?:strong|b)>)|(<\/?i>)|(<\/?code>)|(<\/?p>)|(<hr>)|(<\/?center>)|(<\/?[a-z][^>]+>)/ig;
    var token, anchor_text, anchor_url = null;
    var handled_text = "";
    var last_index  = 0;

    while ((token = tokenizer.exec(text))) {
        if (!anchor_url) {
            handled_text += text.substring(last_index, token.index);
    
            if (token[1]) { // anchor
                anchor_url = token[1];
                anchor_text = "";
            } else if (token[3]) { // image
                handled_text += "![](" + token[3] + ")";
            } else if (token[4]) { // strong, b
                handled_text += "**";
            } else if (token[5]) { // i
                handled_text += "*";
            } else if (token[6]) { // code
                handled_text += "`";
            } else if (token[7]) { // p
                handled_text += "\n";
            } else if (token[8]) { // hr
                handled_text += "---";
            } else if (token[9] || token[10]) { // center
                handled_text += token[9] || token[10];
            }
        } else {
            anchor_text += text.substring(last_index, token.index);

            if (token[2]) {
                handled_text += "[" + MarkdownParser.__handle_html_tags(anchor_text) + "](" + anchor_url + ")";
                anchor_url = null;
            } else {
                anchor_text += token[0];
            }
        }

        last_index = tokenizer.lastIndex;
    }

    handled_text += text.substring(last_index, text.length);

    return handled_text;
}

MarkdownParser.__outdent = function(text) {
    var leadings = text.match(/^(\t| )+/);

    if (leadings) {
        return text.replace(new RegExp(leadings[0], 'gm'), '');
    }

    return text;
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

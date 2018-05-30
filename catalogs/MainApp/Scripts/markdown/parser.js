MarkdownParser = (function() {
    return {};
})();

MarkdownParser.parse = function(text) {
    console.log(text);
    return MarkdownParser.__parse_to_markdown(text, false);
}

MarkdownParser.__parse_to_markdown = function(text, inline) {
    var tokenizer = /((?:^|\n+)(?:---+|- -(?: -)+|\*\*\*+|\* \*(?: \*)+)\n+)|(?:(?:^|\n)```(\w*)\n([\s\S]*?)```(?:\n+|$))|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)>\s*.*)(?:\n(?:(?:>.*)|(?:.+)))*)|((?:(?:^|\n)(?:[*+-]|\d+\.)\s+.*(?:\n.+)*)+)|(?:\!\[([^\]]*?)\]\(([^\s]+?)\))|(\[)|(\](?:\(([^\s]+?)\))?)|(?:(?:^|\n)(#{1,6})(?:\n+|$))|(?:(?:^|\n)(#{1,6})\s*(.+)(?:\n+|$))|((?:https?:\/\/)((?:[a-z0-9\-]+\.?)+)((?:\/[a-zA-Z0-9_@%:\/\.\-]+)|\/)?(?:(?:\?[^\s]+)|(?:\#[^\s]+))?)|(?:`([^`]*)`)|(?:<a[^>]*href=\"([^"]+)\"[^>]*>)(.+)<\/a>|(?:<img[^>]*src=\"([^"]+)\"[^>]*\/?>(?:<\/img>)?)|(?:<strong>(.*)<\/strong>)|(?:<b>(.*)<\/b>)|(?:<i>(.*)<\/i>)|(?:<code>(.*)<\/code>)|(?:<sub>(.*)<\/sub>)|(?:<sup>(.*)<\/sup>)|(<div[^>]*>)|(<\/div[^>]*>)|(<p[^>]*>)|(<\/p[^>]*>)|(<center>)|(<\/center>)|(<br[^>]*>)|(<hr>)|(<\/?[a-z][^>]*>)|(  \n\n*|\n{2,}|\*{1,3}|_{1,3}|~{2})/gm;
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
                type:inline ? "inline-code" : "code",
                data:{
                    text:MarkdownParser.__outdent(token[3] || token[4]).replace(/^\n+|\n+$/g, '')
                }
            }
        } else if (token[5]) { // > quote
            var lines = token[5].split(/(?:^|\n)>\s*/g).slice(1);
            var items = [];
            lines.forEach(function(line) {
                items.push(MarkdownParser.__parse_to_markdown(line, false));
            });
            element = {
                type:"quote",
                data:{
                    items:items, 
                    inline:inline
                }
            }

            MarkdownParser.__clear_unhandled_begins(elements);
        } else if (token[6]) { // -* list
            var lines = token[6].split(/(?:^|\n)(?:[*+-]|\d+\.)\s+/g).slice(1);
            var number = token[6].match(/(?:^|\n)(?:[*+-]|(\d+)\.)/)[1];
            var items = [];
            lines.forEach(function(line) {
                var elements = MarkdownParser.__parse_to_markdown(line.replace(/\n\s+/g, "\n"), false);

                elements.splice(0, 0, {
                    type:"bullet",
                    data:{
                        symbol:number ? (items.length + parseInt(number)) + "." : ""
                    }
                });

                items.push(elements);
            });
            element = {
                type:"list",
                data:{
                    items:items, 
                    inline:inline
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
                    elements:MarkdownParser.__parse_to_markdown(token[13] ? token[14].replace(/\s+#+$/, "") : "", true),
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
                    elements:MarkdownParser.__parse_to_markdown(token[18], true)
                }
            }
        } else if (token[19]) { // anchor tag
            element = {
                type:"anchor-tag",
                data:{
                    url:token[19],
                    elements:MarkdownParser.__parse_to_markdown(token[20], true)
                }
            }
        } else if (token[21]) { // image tag
            element = {
                type:"image-tag",
                data:{
                    url:token[21]
                }
            }
        } else if (token[22]) { // strong tag
            element = {
                type:"strong-tag",
                data:{
                    elements:MarkdownParser.__parse_to_markdown(token[22], true)
                }
            }
        } else if (token[23]) { // bold tag
            element = {
                type:"bold-tag",
                data:{
                    elements:MarkdownParser.__parse_to_markdown(token[23], true)
                }
            }
        } else if (token[24]) { // italic tag
            element = {
                type:"italic-tag",
                data:{
                    elements:MarkdownParser.__parse_to_markdown(token[24], true)
                }
            }
        } else if (token[25]) { // code tag
            element = {
                type:"code-tag",
                data:{
                    elements:MarkdownParser.__parse_to_markdown(token[25], true)
                }
            }
        } else if (token[26]) { // sub tag
            element = {
                type:"sub-tag",
                data:{
                    elements:MarkdownParser.__parse_to_markdown(token[26], true)
                }
            }
        } else if (token[27]) { // sup tag
            element = {
                type:"sup-tag",
                data:{
                    elements:MarkdownParser.__parse_to_markdown(token[27], true)
                }
            }
        } else if (token[28]) { // start of div tag
            element = {
                type:"div-tag-begin",
                data:{
                    class:token[28].match(/class=\"([^"]+)\"/)[1] || ""
                }
            }
        } else if (token[29]) { // end of div tag
            element = {
                type:"div-tag-end",
                data:{
                    /* no data */
                }
            }
        } else if (token[30] || token[31]) { // paragraph tag
            element = {
                type:"paragraph-tag" + token[30] ? "-begin" : "-end",
                data:{
                    /* no data */
                }
            }
        } else if (token[32] || token[33]) { // center tag
            element = {
                type:"center-tag" + token[32] ? "-begin" : "-end",
                data:{
                    /* no data */
                }
            }
        } else if (token[34]) { // br tag
            element = {
                type:"br-tag",
                data:{
                    /* no data */
                }
            }
        } else if (token[35]) { // hr tag
            element = {
                type:"hr-tag",
                data:{
                    /* no data */
                }
            }
        } else if (token[36]) { // unhandled tag
            element = {
                type:"tag",
                data:{
                    /* no data */
                }
            }
        } else if (token[37]) { // inline formatting: *em*, **strong**, ...
            var symbol = token[37] ? token[37][0] : "";

            if (symbol === "*" || symbol === "_" || symbol === "~") {
                var formatter_begin = MarkdownParser.__last_formatter_begin(elements, symbol);

                if (formatter_begin) {
                    var length = Math.min(formatter_begin.data["text"].length, token[37].length);
                    var type = (symbol === "~") ? "linethrough" : (length == 3) ? "em-italic" : (length == 2) ? "em" : "italic";

                    formatter_begin["type"] = type + "-begin";
                    formatter_begin.data["prior"] = formatter_begin.data["text"].substring(0, token[37].length - length);

                    element = {
                        type:type + "-end",
                        data:{
                            trailing:token[37].substring(0, formatter_begin.data["text"].length - length)
                        }
                    }
                } else {
                   element = {
                        type:"formatter-begin",
                        data:{
                            text:token[37]
                        }
                    }
                }
            } else {
                element = {
                    type:"break",
                    data:{
                        text:token[37]
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

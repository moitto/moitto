MarkdownParser = (function() {
    return {};
})();

MarkdownParser.parse = function(text) {
    console.log(text);
    var elements = MarkdownParser.__parse_to_markdown(text, false);

    elements.forEach(function(element) {
        console.log(JSON.stringify(element));
        console.log("============");
    });

    return elements;
}

MarkdownParser.__parse_to_markdown = function(text, inline) {
    var tokenizer = /((?:^|\n+)\s{0,3}(?:(?:-\s*)+|(?:_\s*)+|(?:\*\s*)+)(?:\n+|$))|(?:(?:^|\n)```(\w*)\n([\s\S]*?)```(?:\n+|$))|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n{1,2})\s*>.*(?:\n.+)*)+)|((?:(?:^|\n{1,2})(?:[*+-]|\d+\.)\s+.*(?:\n.+)*)+)|((?:^|\n+)\s*\|?(?:[^\n|]*\|)+(?:[^\n|]*\|?)\n\s*\|?(?:(?:\s*:?-+:?\s*)\|)+(?:(?:\s*:?-+:?\s*)\|?)(?:\n|$)(?:\s*\|?(?:[^\n|]*\|)+(?:[^\n|]*\|?)(?:\n|$))*)|\!\[(.*?)\]\(((?:\([^)]*\)|.)*?)\)|(\[)|(\]\((.*?)\))|(\])|(?:(?:^|\n)\s*(#{1,6})(?:\n+|$))|(?:(?:^|\n)\s*(#{1,6})\s*(.+)(?:\n+|$))|((?:https?:\/\/)((?:[a-z0-9\-]+\.?)+)((?:\/[a-zA-Z0-9~_@%:,\/\.\-\+\*]+)|\/)?(?:(?:\?[^\s]+)|(?:\#[^\s]+))?)|(?:`([^`]*)`)|(?:<a[^>]*href=\"([^"]+)\"[^>]*>)(.+)<\/a>|(?:<img[^>]*src=\"([^"]+)\"[^>]*\/?>(?:<\/img>)?)|(?:<(strong|strike|b|i|code|sub|sup)>)|(?:<\/(strong|strike|b|i|code|sub|sup)>)|(<h[1-6][^>]*>)|(<\/h[1-6][^>]*>)|(<div[^>]*>)|(<\/div[^>]*>)|(<p[^>]*>)|(<\/p[^>]*>)|(<blockquote[^>]*>)|(<\/blockquote[^>]*>)|(<center>)|(<\/center>)|(<br[^>]*>)|(<hr>)|(<\/?[a-z][^>]*>)|(  \n\n*|\n{2,}|(\s?)(_{1,3})|(\*{1,3})|(~{2}))/igm;
    var elements = [], begin_tags = [];
    var token, text_chunk, chunk, element;
    var last_index = 0;

    while ((token = tokenizer.exec(text))) {
        text_chunk = text.substring(last_index, token.index);
        chunk = token[0];

        if (token[1]) { // line
            element = {
                type:"line",
                data:{
                    inline:inline
                }
            }
        } else if (token[3] || token[4]) { // code/indent block
            element = {
                type:"code",
                data:{
                    text:MarkdownParser.__outdent(token[3] || token[4]).replace(/^\n+|\n+$/g, ''),
                    inline:inline
                }
            }
        } else if (token[5]) { // > quote
            var lines = token[5].split(/(?:^|\n)\s*>\s*/g).slice(1);
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
                        symbol:number ? (inline ? number : items.length + 1) + "." : ""
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
        } else if (token[7]) { // table
            var lines = token[7].trim().split("\n");
            var headers = [], columns = [], rows = [];

            lines[0].replace(/^\||\|$/g, "").split("|").forEach(function(text) {
                headers.push(MarkdownParser.__parse_to_markdown(text.trim(), true));
            });

            lines[1].replace(/^\||\|$/g, "").split("|").forEach(function(text) {
                columns.push(MarkdownParser.__align_for_table_column(text.trim()));
            });

            lines.slice(2).forEach(function(line) {
                var row = [];
                line.replace(/^\||\|$/g, "").split("|").forEach(function(text) {
                    row.push(MarkdownParser.__parse_to_markdown(text.trim(), true));
                });

                rows.push(row);
            });

            element = {
                type:"table",
                data:{
                    headers:headers,
                    columns:columns,
                    rows:rows
                }
            }
        } else if (token[9]) { // image
            element = {
                type:"image",
                data:{
                    url:token[9].trim(),
                    alt:token[8]
                }
            }
        } else if (token[10]) { // begin of link
            element = {
                type:"link-begin-or-text",
                data:{
                    text:token[10] // "[" of "!["
                }
            }     
        } else if (token[11]) { // end of link
            var link_begin_or_text = MarkdownParser.__last_link_begin_or_text(elements);

            if (token[12] && link_begin_or_text) { // link
                link_begin_or_text["type"] = "link-begin";
                link_begin_or_text.data["url"] = token[12].trim();

                element = {
                    type:"link-end",
                    data:{
                        url:token[12].trim()
                    }
                }
            } else {
                if (link_begin_or_text) {
                    link_begin_or_text["type"] = "text";
                }

                element = {
                    type:"text",
                    data:{
                        text:token[11] // "](...)"
                    }
                }
            }
        } else if (token[13]) { // "]"
            var link_begin_or_text = MarkdownParser.__last_link_begin_or_text(elements);

            if (link_begin_or_text) {
                link_begin_or_text["type"] = "text";
            }

            element = {
                type:"text",
                data:{
                    text:token[13] // "]"
                }
            }
        } else if (token[14] || token[15]) { // headings
            element = {
                type:"heading",
                data:{
                    elements:MarkdownParser.__parse_to_markdown(token[15] ? token[16].replace(/\s+#+$/, "") : "", true),
                    level:(token[14] || token[15]).length,
                    leadings:(token.index > 0) ? "\n" : "",
                    inline:inline
                }
            }
        } else if (token[17]) { // url
            element = {
                type:"url",
                data:{
                    url:token[17].trim(),
                    host:token[18],
                    path:token[19]
                }
            }
        } else if (token[20]) { // `code`
            element = {
                type:"code",
                data:{
                    elements:MarkdownParser.__parse_to_markdown(token[20], true),
                    inline:true
                }
            }
        } else if (token[21]) { // anchor tag
            element = {
                type:"anchor-tag",
                data:{
                    url:token[21].trim(),
                    elements:MarkdownParser.__parse_to_markdown(token[22], true),
                    inline:inline
                }
            }
        } else if (token[23]) { // image tag
            element = {
                type:"image-tag",
                data:{
                    url:token[23].trim(),
                    inline:inline
                }
            }
        } else if (token[24] || token[25]) { // strong, strike, bold, italic, code, sub, and sup tag
            element = {
                type:(token[24] || token[25]) + "-tag" + (token[24] ? "-begin" : "-end"),
                data:{
                    inline:inline
                }
            }
        } else if (token[26] || token[27]) { // h1~h6 tag
            var level = (token[26] || token[27]).match(/<\/?h([1-6])/);

            element = {
                type:"h-tag" + (token[26] ? "-begin" : "-end"),
                data:{
                    level:parseInt(level[1]),
                    inline:inline
                }
            }
        } else if (token[28]) { // start of div tag
            var klass = token[28].match(/class=\"([^"]+)\"/);

            element = {
                type:"div-tag-begin",
                data:{
                    class:klass ? klass[1] : "",
                    inline:inline
                }
            }
        } else if (token[29]) { // end of div tag
            element = {
                type:"div-tag-end",
                data:{
                    inline:inline
                }
            }
        } else if (token[30] || token[31]) { // paragraph tag
            element = {
                type:"paragraph-tag" + (token[30] ? "-begin" : "-end"),
                data:{
                    inline:inline
                }
            }
        } else if (token[32] || token[33]) { // blockquote tag
            element = {
                type:"blockquote-tag" + (token[32] ? "-begin" : "-end"),
                data:{
                    inline:inline
                }
            }
        } else if (token[34] || token[35]) { // center tag
            element = {
                type:"center-tag" + (token[34] ? "-begin" : "-end"),
                data:{
                    inline:inline
                }
            }
        } else if (token[36]) { // br tag
            element = {
                type:"br-tag",
                data:{
                    inline:inline
                }
            }
        } else if (token[37]) { // hr tag
            element = {
                type:"hr-tag",
                data:{
                    inline:inline
                }
            }
        } else if (token[38]) { // unhandled tag
            element = {
                type:"tag",
                data:{
                    inline:inline
                }
            }
        } else if (token[39]) { // inline formatting: *em*, **strong**, ...
            var symbols = token[41] || (token[42] || (token[43] || ""));
            var symbol = symbols ? symbols[0] : "";
            var prior = token[40] || "";

            if (symbol === "_" || symbol === "*" || symbol === "~") {
                var formatter_begin = MarkdownParser.__last_formatter_begin(elements, symbol);

                 if (formatter_begin && !(symbol === "_" && token[40])) {
                    var begin_symbols = formatter_begin.data["symbols"];
                    var length = Math.min(begin_symbols.length, symbols.length);
                    var type = (symbol === "~") ? "linethrough" : (length == 3) ? "em-italic" : (length == 2) ? "em" : "italic";

                    formatter_begin["type"] = type + "-begin";
                    formatter_begin["data"] = {
                        prior:formatter_begin.data["prior"] + begin_symbols.substring(0, symbols.length - length)
                    }

                    element = {
                        type:type + "-end",
                        data:{
                            trailing:symbols.substring(0, begin_symbols.length - length)
                        }
                    }
                } else {
                    element = {
                        type:"formatter-begin",
                        data:{
                            text:prior + symbols,
                            prior:prior,
                            symbols:symbols
                        }
                    }
                }
            } else {
                element = {
                    type:"break",
                    data:{
                        text:token[39]
                    }
                }
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

        var tag = element.type.match(/(.+)-tag-(begin|end)/);

        if (tag) {
            if (tag[2] === "begin") {
                begin_tags.push(element);
            } else {
                MarkdownParser.__handle_mismatched_tags(elements, tag[1], element.data["inline"], begin_tags);
            }
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
    MarkdownParser.__handle_mismatched_tags(elements, "", false, begin_tags);

    return elements;
}

MarkdownParser.__outdent = function(text) {
    var leadings = text.match(/^(\t| )+/);

    if (leadings) {
        return text.replace(new RegExp(leadings[0], 'gm'), '');
    }

    return text;
}

MarkdownParser.__align_for_table_column = function(text) {
    if (text[0] === ":") {
        if (text[text.length - 1] === ":") {
            return "center";
        }

        return "left";
    } 

    if (text[text.length - 1] === ":") {
        return "right";
    }

    return "left";
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
                if (elements[i].data["symbols"][0] === symbol) {
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
        }
    });
}

MarkdownParser.__handle_mismatched_tags = function(elements, tag, inline, begin_tags) {
    var begin_matched = false;

    while (begin_tags.length > 0) {
        var last_begin_tag = begin_tags.pop();

        if (tag && last_begin_tag.type.startsWith(tag)) {
            begin_matched = true;

            break;
        }

        elements.push({
            type:last_begin_tag.type.split("-")[0] + "-tag-end",
            data:{
                inline:last_begin_tag.data["inline"]
            }
        });
    }

    if (tag && !begin_matched) {
        elements.push({
            type:tag + "-tag-begin",
            data:{
                inline:inline
            }
        });
    }
}

__MODULE__ = MarkdownParser;

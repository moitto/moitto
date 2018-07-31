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
    var tokenizer = /((?:^|\n+)[ \t]{0,3}(?:(?:-[ \t]*)+|(?:_[ \t]*)+|(?:\*[ \t]*)+)(?:\n+|$))|(?:(?:^|\n)[ \t]*```(.*)\n((?:.*\n)*?)[ \t]*```[ \t]*(?:\n+|$))|(?:(?:^|\n+)((?:(?:\t| {4}).+(?:\n[ \t]*)*)+)(?:\n+|$))|((?:(?:^|\n)[ \t]*>.*(?:\n[ \t]*[^ \t\n].+)*)+)|((?:(?:^|\n)[ \t]*(?:[*+-]|\d+\.)[ \t]+.*(?:\n[ \t]*[^ \t\n].+)*(?:[ \t]*\n[ \t]*)?)+)|((?:^|\n+)[ \t]*\|?(?:[^\n|]*\|)+(?:[^\n|]*\|?)?\n[ \t]*\|?(?:(?:[ \t]*:?-+:?[ \t]*)\|)+(?:(?:[ \t]*:?-+:?[ \t]*)\|?)?(?:\n|$)(?:[ \t]*\|?(?:[^\n|]*\|)+(?:[^\n|]*\|?)?(?:\n|$))*)|\!\[(.*?)\]\(((?:\([^)]*?\)|[^)])*)\)|(\[)|(\]\(((?:\([^)]*?\)|[^)])*)\))|(\])|(?:(?:^|\n)[ \t]*(#{1,6})(?:\n+|$))|(?:(?:^|\n)[ \t]*(#{1,6})[ \t]+(.+)(?:\n+|$))|((?:https?:\/\/)((?:[a-z0-9\-]+\.?)+)((?:\/[a-zA-Z0-9~_@%:,\/\.\-\+\*]+)|\/)?(?:(?:\?[^ \t\n<]+)|(?:\#[^ \t\n<]+))?)|(`+[^`]*`+)|(?:<a[^>]*href=(\".+?\"|\'.+?\'|[^ \t>]+?).*?>)(.+?)<\/a>|(?:<img[^>]*src=(\".+?\"|\'.+?\'|[^ \t>]+).*?\/?>(?:<\/img>)?)|(?:<iframe[^>]*src=(\".+?\"|\'.+?\'|[^ \t>]+).*?\/?>(?:<\/iframe>)?)|(?:<(strong|strike|b|i|code|sub|sup)>)|(?:<\/(strong|strike|b|i|code|sub|sup)>)|(<h[1-6][^>]*>)|(<\/h[1-6][^>]*>)|(<div[^>]*>)|(<\/div[^>]*>)|(<p[^>]*>)|(<\/p[^>]*>)|(<blockquote[^>]*>)|(<\/blockquote[^>]*>)|(<center>)|(<\/center>)|(<pre>)|(<\/pre>)|(?:<(table|tr|th|td)>)|(?:<\/(table|tr|th|td)>)|(\n*<br[^>]*>\n*)|(\n*<hr>\n*)|(<\/?[a-z][^>]*>)|((?:[ \t]*\n){2,}|([ \t]?)(?:(_{1,3})|(\*{1,3})|(~{2})))/igm;
    var elements = [], begin_tags = [];
    var token, text_chunk, element;
    var last_index = 0;

    while ((token = tokenizer.exec(text))) {
        text_chunk = text.substring(last_index, token.index);

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
                    text:MarkdownParser.__outdent(token[3] || token[4]),
                    inline:inline
                }
            }
        } else if (token[5]) { // > quote
            element = {
                type:"quote",
                data:{
                    elements:MarkdownParser.__parse_to_markdown(token[5].replace(/(^|\n)[ \t]*>/g, "$1"), false), 
                    inline:inline
                }
            }
        } else if (token[6]) { // -* list
            var lines = token[6].replace(/^\n+|\n+$/, "").split("\n");
            var items = [], indents = [], numbers = [];
            var level = 0, number = "", subtext = "";

            lines.forEach(function(line) {
                var match = line.match(/^([ \t]*)(?:[*+-]|(\d+)\.)[ \t]+(.*)/);
                var indent = match ? match[1].length : 0;

                if (match && (level == 0 || indent < indents[level - 1] + 6)) {
                    if (subtext) {
                        var children = MarkdownParser.__parse_to_markdown(subtext, false);
                        var symbol = numbers[level - 1] ? (inline ? number : numbers[level - 1]) + "." : "";

                        items.push([ symbol, level, children ]);
                    }

                    subtext = match[3];
                    number  = match[2];

                    if (level == 0 || indent > indents[level - 1] + 1) {
                        indents.push(indent);
                        numbers.push(match[2] ? 1 : 0);

                        level = level + 1;
                    } else {
                        level = MarkdownParser.__find_level_for_indent(indents, indent);

                        indents = indents.slice(0, level);
                        numbers = numbers.slice(0, level);

                        indents[level - 1] = indent;
                        numbers[level - 1] = match[2] ? numbers[level - 1] + 1 : 0;
                    }
                } else {
                    subtext = subtext + "\n" + line;
                }
            });

            if (subtext) {
                var children = MarkdownParser.__parse_to_markdown(subtext, false);
                var symbol = numbers[level - 1] ? (inline ? number : numbers[level - 1]) + "." : "";

                items.push([ symbol, level, children ]);
            }

            element = {
                type:"list",
                data:{
                    items:items, 
                    inline:inline
                }
            }
        } else if (token[7]) { // table
            var lines = token[7].trim().split("\n");
            var headers = [], columns = [], rows = [];

            lines[0].replace(/^[ \t]*\||\|[ \t]*$/g, "").trim().split("|").forEach(function(text) {
                headers.push(MarkdownParser.__parse_to_markdown(text.trim(), true));
            });

            lines[1].replace(/^[ \t]*\||\|[ \t]*$/g, "").trim().split("|").forEach(function(text) {
                columns.push(MarkdownParser.__align_for_table_column(text.trim()));
            });

            lines.slice(2).forEach(function(line) {
                var row = [];
                line.replace(/^[ \t]*\||\|[ \t]*$/g, "").trim().split("|").forEach(function(text) {
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
                    text:token[10], // "[" of "!["
                    inline:inline
                }
            }     
        } else if (token[11]) { // end of link
            var link_begin_or_text = MarkdownParser.__last_link_begin_or_text(elements);

            if (token[12] && link_begin_or_text) { // link
                link_begin_or_text["type"] = "link-begin";
                link_begin_or_text.data["url"] = token[12].replace(/[ \t]+\".*?\"[ \t]*$/g, "").trim();

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
                        text:token[11], // "](...)"
                        inline:inline
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
                    text:token[13], // "]"
                    inline:inline
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
        } else if (token[20]) { // ``code``
            var code = token[20].match(/(`+)([^`]*)(`+)/);

            if (code[1].length == code[3].length) {
                element = {
                    type:"code",
                    data:{
                        elements:MarkdownParser.__parse_to_markdown(code[2], true),
                        inline:true
                    }
                }                
            } else {
                element = {
                    type:"text",
                    data:{
                        text:token[20],
                        inline:inline
                    }
                }
            }
        } else if (token[21]) { // anchor tag
            element = {
                type:"anchor-tag",
                data:{
                    url:token[21].replace(/^["']|["']/g, "").trim(),
                    elements:MarkdownParser.__parse_to_markdown(token[22], true),
                    inline:inline
                }
            }
        } else if (token[23]) { // image tag
            element = {
                type:"image-tag",
                data:{
                    url:token[23].replace(/^["']|["']/g, "").trim(),
                    inline:inline
                }
            }
        } else if (token[24]) { // iframe tag
            element = {
                type:"iframe-tag",
                data:{
                    url:token[24].replace(/^["']|["']/g, "").trim(),
                    inline:inline
                }
            }
        } else if (token[25] || token[26]) { // strong, strike, bold, italic, code, sub, and sup tag
            element = {
                type:(token[25] || token[26]) + "-tag" + (token[25] ? "-begin" : "-end"),
                data:{
                    inline:inline
                }
            }
        } else if (token[27] || token[28]) { // h1~h6 tag
            var level = (token[27] || token[28]).match(/<\/?h([1-6])/);

            element = {
                type:"h-tag" + (token[27] ? "-begin" : "-end"),
                data:{
                    level:parseInt(level[1]),
                    inline:inline
                }
            }
        } else if (token[29]) { // start of div tag
            var klass = token[29].match(/class=\"([^"]+)\"/);

            element = {
                type:"div-tag-begin",
                data:{
                    class:klass ? klass[1] : "",
                    inline:inline
                }
            }
        } else if (token[30]) { // end of div tag
            element = {
                type:"div-tag-end",
                data:{
                    inline:inline
                }
            }
        } else if (token[31] || token[32]) { // paragraph tag
            element = {
                type:"paragraph-tag" + (token[31] ? "-begin" : "-end"),
                data:{
                    inline:inline
                }
            }
        } else if (token[33] || token[34]) { // blockquote tag
            element = {
                type:"blockquote-tag" + (token[33] ? "-begin" : "-end"),
                data:{
                    inline:inline
                }
            }
        } else if (token[35] || token[36]) { // center tag
            element = {
                type:"center-tag" + (token[35] ? "-begin" : "-end"),
                data:{
                    inline:inline
                }
            }
        } else if (token[37] || token[38]) { // pre tag
            element = {
                type:"pre-tag" + (token[37] ? "-begin" : "-end"),
                data:{
                    inline:inline
                }
            }
        } else if (token[39] || token[40]) { // table, tr, th, td tag
            element = {
                type:(token[39] || token[40]) + "-tag" + (token[39] ? "-begin" : "-end"),
                data:{
                    inline:inline
                }
            }
        } else if (token[41]) { // br tag
            element = {
                type:"br-tag",
                data:{
                    inline:inline
                }
            }
        } else if (token[42]) { // hr tag
            element = {
                type:"hr-tag",
                data:{
                    inline:inline
                }
            }
        } else if (token[43]) { // unhandled tag
            element = {
                type:"tag",
                data:{
                    inline:inline
                }
            }
        } else if (token[44]) { // inline formatting: *em*, **strong**, ...
            var symbols = token[46] || (token[47] || (token[48] || ""));
            var symbol = symbols ? symbols[0] : "";
            var prior = token[45] || "";

            if (symbol === "_" || symbol === "*" || symbol === "~") {
                var formatter_begin = MarkdownParser.__last_formatter_begin(elements, symbol);

                 if (formatter_begin && !token[45]) {
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
                            symbols:symbols,
                            inline:inline
                        }
                    }
                }
            } else {
                element = {
                    type:"break",
                    data:{
                        text:token[44]
                    }
                }

                MarkdownParser.__clear_unhandled_begins(elements);
            }
        }

        if (text_chunk) {
            elements.push({
                type:"text",
                data:{
                    text:text_chunk,
                    inline:inline
                }
            });
        }

        var tag = element["type"].match(/(.+)-tag-(begin|end)/);

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
    
    if (text_chunk) {
        elements.push({
            type:"text",
            data:{
                text:text_chunk,
                inline:inline
            }
        });
    }

    MarkdownParser.__clear_unhandled_begins(elements);
    MarkdownParser.__handle_mismatched_tags(elements, "", false, begin_tags);

    return elements;
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

MarkdownParser.__outdent = function(text) {
    var leadings = text.match(/^(\t| {4})/);

    if (leadings) {
        var lines = [];

        text.split("\n").forEach(function(line) {
            lines.push(line.replace(new RegExp(leadings[0], "g"), ""));
        });

        return lines.join("\n");
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

MarkdownParser.__find_level_for_indent = function(indents, indent) {
    for (var index = indents.length - 1; index >= 0; --index) {
        if (indents[index] <= indent) {
            return index + 1;
        }
    }

    return 1;
}

__MODULE__ = MarkdownParser;

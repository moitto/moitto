MarkdownParser = (function() {
    return {};
})();

MarkdownParser.parse = function(text) {
    console.log(text);
    var elements = MarkdownParser.__parse_to_markdown(MarkdownParser.__normalize_text(text), false);

    elements.forEach(function(element) {
        console.log(JSON.stringify(element));
        console.log("============");
    });

    return elements;
}

MarkdownParser.__parse_to_markdown = function(text, inline) {
    var tokenizer = /((?:^|\n+) {0,3}(?:(?:- *)+|(?:_ *)+|(?:\* *)+)(?:\n+|$))|(?:(?:^|\n) {0,3}(`{3,}|~{3,})(.*)(?:\n|$))|((?:(?:^|\n) *>(?: *[^ \n].*(?:\n *[^ \n].*)*|.*))+)|((?:(?:^|\n) *\* +.*(?:\n *[^ \n].+)*(?: *\n *)?)+|(?:(?:^|\n) *\+ +.*(?:\n *[^ \n].+)*(?: *\n *)?)+|(?:(?:^|\n) *\- +.*(?:\n *[^ \n].+)*(?: *\n *)?)+|(?:(?:^|\n) *\d+\. +.*(?:\n *[^ \n].+)*(?: *\n *)?)+)|((?:^|\n+) *\|?(?:[^\n|]*\|)+(?:[^\n|]*)?\n *\|?(?:(?: *:?-+:? *)\|)+(?: *:?-+:? *)? *(?:\n|$)(?: *\|?(?:[^\n|]*\|)+(?:[^\n|]*)?(?:\n|$))*)|\!\[(.*?)\]\(((?:\([^)]*?\)|[^)])*)\)|(\[)|(\]\(((?:\([^)]*?\)|[^)])*)\))|(\])|(?:(?:^|\n) *(#{1,6}) *(?:\n+|$))|(?:(?:^|\n) *(#{1,6}) +(.+)(?:\n+|$))|((?:https?:\/\/)((?:[a-z0-9\-]+\.?)+(?::[0-9]+)?)((?:\/(?:\([\w\d.\-_~$&'+,;=:@%\u00C0-\uFFFF]*\)|[\w\d.\-_~$&'+,;=:@%\u00C0-\uFFFF])+)|\/)*(?:[?#][\w\d.\-_~$&'+,;=:@%/\u00C0-\uFFFF]+)*)|(`+[^`]*`+)|(?:<a[^>]*href=(\".+?\"|\'.+?\'|[^ \t>]+?).*?>)(.+?)<\/a>|(?:<img[^>]*src=(\".+?\"|\'.+?\'|[^ \t>]+).*?\/?>(?:<\/img>)?)|(?:<iframe[^>]*src=(\".+?\"|\'.+?\'|[^ \t>]+)[^>]*>(?:<\/iframe>)?)|(?:<(strong|strike|b|i|code|sub|sup)>)|(?:<\/(strong|strike|b|i|code|sub|sup)>)|(<h[1-6][^\n>]*>)|(<\/h[1-6][^\n>]*>)|(<div[^\n>]*>)|(<\/div[^\n>]*>)|(<p(?: +[^\n>]*)?>)|(<\/p(?: +[^\n>]*)?>)|(<blockquote>)|(<\/blockquote>)|(<center>)|(<\/center>)|(<pre>)|(<\/pre>)|(?:<(table|tr|th|td)>)|(?:<\/(table|tr|th|td)>)|(\n*<br *\/?>)|(\n*<hr *\/?>)|(<\/?[a-z]+(?: +[^\n>]*)?>)|((?: *\n){2,}|([ \n]?)(?:(_{1,3})|(\*{1,3})|(~{2})))/igm;
    var elements = [], begin_tags = [], formatters = [];
    var code_begin = null, pre_begin = null;
    var token, text_chunk, element;
    var last_index = 0;

    while ((token = tokenizer.exec(text))) {
        text_chunk = text.substring(last_index, token.index);

        if (!code_begin && !pre_begin) {
            if (token[1]) { // line
                element = {
                    type:"line",
                    data:{
                        inline:inline,
                        break:true
                    }
                }
            } else if (token[2]) { // code block
               element = {
                    type:"code-begin",
                    data:{
                        delemeters:token[2],
                        alt:token[3] || "",
                        inline:inline,
                        break:true
                    }
                }

                code_begin = element;
            } else if (token[4]) { // > quote
                var lines = token[4].replace(/^\n+|\n+$/, "").split(/(?:\n|^) *>/g).slice(1);

                lines.forEach(function(line) {
                    var children = MarkdownParser.__parse_to_markdown(line.trim() + "\n", false);
                    var break_met = false, first_child = true;

                    if (!element) {
                        element = {
                            type:"quote",
                            data:{
                                elements:[], 
                                inline:inline,
                                break:true
                            }
                        }
                    }

                    children.forEach(function(child) {
                        if (!break_met && !first_child && child.data["break"]) {
                            if (text_chunk) {
                                elements.push({
                                    type:"text",
                                    data:{
                                        text:text_chunk,
                                        inline:inline,
                                        break:true
                                    }
                                });
                            }

                            elements.push(element);
                            elements.push(child);

                            element    = null;
                            text_chunk = null;
                            break_met  = true;
                        } else {
                            if (break_met) {
                                elements.push(child);
                            } else {
                                element.data["elements"].push(child);
                            }
                        }

                        first_child = false;
                    });
                });
            } else if (token[5]) { // *+- list
                var lines = token[5].replace(/^\n+|\n+$/, "").split("\n");
                var mark = token[5].match(/(?:^|\n) *([*+-])|(\d+)\. +/)[1];
                var indents = [], numbers = [];
                var level = 0, number = "", subtext = "";

                lines.forEach(function(line) {
                    var match = line.match(/^( *)(?:([*+-])|(\d+)\.) +(.*)/);
                    var indent = match ? match[1].length : 0;

                    if (!element) {
                        element = {
                            type:"list",
                            data:{
                                items:[], 
                                inline:inline,
                                break:true
                            }
                        }
                    }

                    if (match && (match[2] === mark) && (level == 0 || indent < indents[level - 1] + 6)) {
                        if (subtext) {
                            var children = MarkdownParser.__parse_to_markdown(subtext, false);
                            var symbol = numbers[level - 1] ? (inline ? number : numbers[level - 1]) + "." : "";
                            var items = [], break_met = false, first_child = true;

                            children.forEach(function(child) {
                                if (!break_met && child.data["break"]) {
                                    if (text_chunk) {
                                        elements.push({
                                            type:"text",
                                            data:{
                                                text:text_chunk,
                                                inline:inline,
                                                break:true
                                            }
                                        });
                                    }

                                    element.data["items"].push([ symbol, level, items ]);
                                    elements.push(element);

                                    if (first_child) {
                                        items.push(child);
                                    } else {
                                        elements.push(child);
                                    }
                            
                                    element    = null;
                                    text_chunk = null;
                                    break_met  = true;
                                } else {
                                    if (break_met) {
                                        elements.push(child);
                                    } else {
                                       items.push(child);
                                    }
                                }

                                first_child = false;
                            });

                            if (!break_met) {
                                element.data["items"].push([ symbol, level, items ]);
                            }
                        }

                        subtext = match[4];
                        number  = match[3];

                        if (level == 0 || indent > indents[level - 1] + 1) {
                            indents.push(indent);
                            numbers.push(match[3] ? 1 : 0);

                            level = level + 1;
                        } else {
                            level = MarkdownParser.__find_level_for_indent(indents, indent);

                            indents = indents.slice(0, level);
                            numbers = numbers.slice(0, level);

                            indents[level - 1] = indent;
                            numbers[level - 1] = match[3] ? numbers[level - 1] + 1 : 0;
                        }
                    } else {
                        subtext = subtext + "\n" + line;
                    }
                });

                if (subtext) {
                    var children = MarkdownParser.__parse_to_markdown(subtext, false);
                    var symbol = numbers[level - 1] ? (inline ? number : numbers[level - 1]) + "." : "";
                    var items = [], break_met = false, first_child = true;

                    if (!element) {
                        element = {
                            type:"list",
                            data:{
                                items:[], 
                                inline:inline,
                                break:true
                            }
                        }
                    }

                    children.forEach(function(child) {
                        if (!break_met && child.data["break"]) {
                            if (text_chunk) {
                                elements.push({
                                    type:"text",
                                    data:{
                                        text:text_chunk,
                                        inline:inline,
                                        break:true
                                    }
                                });
                            }

                            element.data["items"].push([ symbol, level, items ]);
                            elements.push(element);

                            if (first_child) {
                                items.push(child);
                            } else {
                                elements.push(child);
                            }
                    
                            element    = null;
                            text_chunk = null;
                            break_met  = true;
                        } else {
                            if (break_met) {
                                elements.push(child);
                            } else {
                                items.push(child);
                            }
                        }

                        first_child = false;
                    });

                    if (!break_met) {
                        element.data["items"].push([ symbol, level, items ]);
                    }
                }
            } else if (token[6]) { // table
                var lines = token[6].trim().split("\n");
                var headers = [], columns = [], rows = [];

                lines[0].replace(/^ *\||\| *$/g, "").trim().split("|").forEach(function(text) {
                    headers.push(MarkdownParser.__parse_to_markdown(text.trim(), true));
                });

                lines[1].replace(/^ *\||\| *$/g, "").trim().split("|").forEach(function(text) {
                    columns.push(MarkdownParser.__align_for_table_column(text.trim()));
                });

                lines.slice(2).forEach(function(line) {
                    var row = [];
                    line.replace(/^ *\||\| *$/g, "").trim().split("|").forEach(function(text) {
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
            } else if (token[8]) { // image
                element = {
                    type:"image",
                    data:{
                        url:token[8].trim(),
                        alt:token[7]
                    }
                }
            } else if (token[9]) { // begin of link
                element = {
                    type:"link-begin-or-text",
                    data:{
                        text:token[9], // "[" of "!["
                        inline:inline
                    }
                }

                formatters.push([]);  
            } else if (token[10]) { // end of link
                var link_begin_or_text = MarkdownParser.__last_link_begin_or_text(elements);

                if (token[11] && link_begin_or_text) { // link
                    link_begin_or_text["type"] = "link-begin";
                    link_begin_or_text.data["url"] = token[11].replace(/ +\".*?\" *$/g, "").trim();

                    element = {
                        type:"link-end",
                        data:{
                            url:token[11].trim()
                        }
                    }

                    MarkdownParser.__clear_unhandled_begins(formatters.pop());
                } else {
                    if (link_begin_or_text) {
                        link_begin_or_text["type"] = "text";
                    }

                    element = {
                        type:"text",
                        data:{
                            text:token[10], // "](...)"
                            inline:inline
                        }
                    }
                }
            } else if (token[12]) { // "]"
                var link_begin_or_text = MarkdownParser.__last_link_begin_or_text(elements);

                if (link_begin_or_text) {
                    link_begin_or_text["type"] = "text";
                }

                element = {
                    type:"text",
                    data:{
                        text:token[12], // "]"
                        inline:inline
                    }
                }
            } else if (token[13] || token[14]) { // headings
                element = {
                    type:"heading",
                    data:{
                        elements:MarkdownParser.__parse_to_markdown(token[14] ? token[15].replace(/\s+#+$/, "") : " ", true),
                        level:(token[13] || token[14]).length,
                        leadings:(token.index > 0) ? "\n" : "",
                        inline:inline,
                        break:true
                    }
                }
            } else if (token[16]) { // url
                element = {
                    type:"url",
                    data:{
                        url:token[16].trim(),
                        host:token[17],
                        path:token[18]
                    }
                }
            } else if (token[19]) { // ``code``
                var code = token[19].match(/(`+)([^`]*)(`+)/);

                if (code[1].length == code[3].length) {
                    element = {
                        type:"code",
                        data:{
                            text:code[2],
                            inline:true
                        }
                    }                
                } else {
                    element = {
                        type:"text",
                        data:{
                            text:token[19],
                            inline:inline
                        }
                    }
                }
            } else if (token[20]) { // anchor tag
                element = {
                    type:"anchor-tag",
                    data:{
                        url:token[20].replace(/^["']|["']/g, "").trim(),
                        elements:MarkdownParser.__parse_to_markdown(token[21], true),
                        inline:inline
                    }
                }
            } else if (token[22]) { // image tag
                element = {
                    type:"image-tag",
                    data:{
                        url:token[22].replace(/^["']|["']/g, "").trim(),
                        inline:inline
                    }
                }
            } else if (token[23]) { // iframe tag
                element = {
                    type:"iframe-tag",
                    data:{
                        url:token[23].replace(/^["']|["']/g, "").trim(),
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
                var level = (token[26] || token[27]).match(/<\/?h([1-6])/i);

                element = {
                    type:"h-tag" + (token[26] ? "-begin" : "-end"),
                    data:{
                        level:parseInt(level[1]),
                        inline:inline
                    }
                }
            } else if (token[28]) { // start of div tag
                var klass = token[28].match(/class=(?:\"([^"]+)\"|([^ ,>]+))/i);

                element = {
                    type:"div-tag-begin",
                    data:{
                        class:klass ? (klass[1] || klass[2]) : "",
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
                        inline:inline,
                        break:true
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
            } else if (token[36]) { // pre tag
                element = {
                    type:"pre-tag-begin",
                    data:{
                        inline:inline,
                        break:true
                    }
                }

                pre_begin = element;
            } else if (token[38] || token[39]) { // table, tr, th, td tag
                element = {
                    type:(token[38] || token[39]) + "-tag" + (token[38] ? "-begin" : "-end"),
                    data:{
                        inline:inline,
                        break:true
                    }
                }
            } else if (token[40]) { // br tag
                element = {
                    type:"br-tag",
                    data:{
                        inline:inline
                    }
                }
            } else if (token[41]) { // hr tag
                element = {
                    type:"hr-tag",
                    data:{
                        inline:inline,
                        break:true
                    }
                }
            } else if (token[42]) { // unhandled tag
                element = {
                    type:"tag",
                    data:{
                        inline:inline
                    }
                }
            } else if (token[43]) { // inline formatting: *em*, **strong**, ...
                var symbols = token[45] || (token[46] || (token[47] || ""));
                var symbol = symbols ? symbols[0] : "";
                var prior = token[44] || "";

                if (symbol === "_" || symbol === "*" || symbol === "~") {
                    var formatter_begin = MarkdownParser.__last_formatter_begin(elements, symbol);
                    var nextchar = text.substring(tokenizer.lastIndex, tokenizer.lastIndex + 1);
                    
                    if (formatter_begin && !token[44] && (symbol !== "_" || nextchar.match(/[^\w\d]/))) {
                        var begin_symbols = formatter_begin.data["symbols"];
                        var length = Math.min(begin_symbols.length, symbols.length);
                        var type = (symbol === "~") ? "linethrough" : (length == 3) ? "em-italic" : (length == 2) ? "em" : "italic";

                        formatter_begin["type"] = type + "-begin";
                        formatter_begin["data"] = Object.assign(formatter_begin["data"], {
                            prior:formatter_begin.data["prior"] + begin_symbols.substring(0, symbols.length - length),
                        });

                        element = {
                            type:type + "-end",
                            data:{
                                trailing:symbols.substring(0, begin_symbols.length - length)
                            }
                        }
                    } else {
                        if (nextchar.match(/[^ \n]/)) {
                            element = {
                                type:"formatter-begin",
                                data:{
                                    text:prior + symbols,
                                    symbols:symbols,
                                    prior:prior,
                                    inline:inline
                                }
                            }

                            if (formatters.length > 0) {
                                formatters[formatters.length - 1].push(element);
                            }
                        } else {
                            element = {
                                type:"text",
                                data:{
                                    text:prior + symbols,
                                    inline:inline
                                }
                            }
                        }
                    }
                } else {
                    element = {
                        type:"break",
                        data:{
                            text:token[43]
                        }
                    }

                    MarkdownParser.__handle_mismatched_tags(elements, "", false, begin_tags);
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

            if (element) {
                var tag = element["type"].match(/(.+)-tag-(begin|end)/);

                if (tag) {
                    if (tag[2] === "begin") {
                        begin_tags.push(element);
                    } else {
                        MarkdownParser.__handle_mismatched_tags(elements, tag[1], element.data["inline"], begin_tags);
                    }
                }

                elements.push(element);
            }
        } else {
            if (code_begin && code_begin.data["delemeters"] === token[2]) {
                element = {
                    type:"code-end",
                    data:{
                        inline:inline,
                        break:true
                    }
                }

                code_begin = null;
            } else if (pre_begin && token[37]) {
                element = {
                    type:"pre-tag-end",
                    data:{
                        inline:inline,
                        break:true
                    }
                }

                pre_begin = null;
            } else {
                element = {
                    type:"text",
                    data:{
                        text:token[0].replace(/ /g, "\xA0"), /* space to nbsp */
                        inline:inline
                    }
                }
            }

            if (text_chunk) {
                elements.push({
                    type:"text",
                    data:{
                        text:text_chunk.replace(/ /g, "\xA0"), /* space to nbsp */
                        inline:inline
                    }
                });
            }

            elements.push(element);
        }

        element    = null;
        text_chunk = null;

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

    MarkdownParser.__handle_mismatched_tags(elements, "", false, begin_tags);
    MarkdownParser.__clear_unhandled_begins(elements);

    return elements;
}

MarkdownParser.__normalize_text = function(text) {
    text = text.replace(/\r\n|\r/g, "\n");
    text = text.replace(/[\xA0\t]/g, " ");

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
                if (elements[i].data["symbols"][0] === symbol) {
                    return elements[i];
                }
            }
        }
    }
}

MarkdownParser.__handle_mismatched_tags = function(elements, tag, inline, begin_tags) {
    if (tag && begin_tags.length > 0 && !begin_tags[begin_tags.length - 1]["type"].startsWith(tag)) {
        elements.push({
            type:tag + "-tag-begin",
            data:{
                inline:inline
            }
        });

        return;
    }

    while (begin_tags.length > 0) {
        var last_begin_tag = begin_tags.pop();

        if (tag && last_begin_tag["type"].startsWith(tag)) {
            return;
        }

        elements.push({
            type:last_begin_tag["type"].split("-")[0] + "-tag-end",
            data:{
                inline:last_begin_tag.data["inline"]
            }
        });
    }

    if (tag) {
        elements.push({
            type:tag + "-tag-begin",
            data:{
                inline:inline
            }
        });        
    }
}

MarkdownParser.__clear_unhandled_begins = function(elements) {
    elements.forEach(function(element) {
        if (["link-begin-or-text", "formatter-begin"].includes(element.type)) {
            element["type"] = "text";
        }
    });
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

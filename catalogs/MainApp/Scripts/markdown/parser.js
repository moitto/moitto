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
    var tokenizer = /((?:^|\n+)\s{0,3}(?:(?:-\s*)+|(?:_\s*)+|(?:\*\s*)+)(?:\n+|$))|(?:(?:^|\n)```(\w*)\n([\s\S]*?)```(?:\n+|$))|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n{1,2})>.*(?:\n.+)*)+)|((?:(?:^|\n{1,2})(?:[*+-]|\d+\.)\s+.*(?:\n.+)*)+)|\!\[([^\]]*)\]\(((?:\([^\)]*\)|[^\)]*)*)\)|(\[)|(\]\(((?:\([^\)]*\)|[^\)]*)*)\))|(\])|(?:(?:^|\n)\s*(#{1,6})(?:\n+|$))|(?:(?:^|\n)\s*(#{1,6})\s*(.+)(?:\n+|$))|((?:https?:\/\/)((?:[a-z0-9\-]+\.?)+)((?:\/[a-zA-Z0-9~_@%:\/\.\-\+\*]+)|\/)?(?:(?:\?[^\s]+)|(?:\#[^\s]+))?)|(?:`([^`]*)`)|(?:<a[^>]*href=\"([^"]+)\"[^>]*>)(.+)<\/a>|(?:<img[^>]*src=\"([^"]+)\"[^>]*\/?>(?:<\/img>)?)|(?:<(strong|strike|b|i|code|sub|sup)>)|(?:<\/(strong|strike|b|i|code|sub|sup)>)|(<div[^>]*>)|(<\/div[^>]*>)|(<p[^>]*>)|(<\/p[^>]*>)|(<blockquote[^>]*>)|(<\/blockquote[^>]*>)|(<center>)|(<\/center>)|(<br[^>]*>)|(<hr>)|(<\/?[a-z][^>]*>)|(  \n\n*|\n{2,}|\*{1,3}|_{1,3}|~{2})/igm;
    var elements = [], begin_tags = [];
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
                    text:token[9] // "[" of "!["
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
                        text:token[10] // "](...)"
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
                    text:token[12] // "]"
                }
            }
        } else if (token[13] || token[14]) { // headings
            element = {
                type:"heading",
                data:{
                    elements:MarkdownParser.__parse_to_markdown(token[14] ? token[15].replace(/\s+#+$/, "") : "", true),
                    level:(token[13] || token[14]).length,
                    leadings:(token.index > 0) ? "\n" : ""
                }
            }
        } else if (token[16]) { // url
            element = {
                type:"url",
                data:{
                    url:token[16],
                    host:token[17],
                    path:token[18]
                }
            }
        } else if (token[19]) { // `code`
            element = {
                type:"inline-code",
                data:{
                    elements:MarkdownParser.__parse_to_markdown(token[19], true)
                }
            }
        } else if (token[20]) { // anchor tag
            element = {
                type:"anchor-tag",
                data:{
                    url:token[20],
                    elements:MarkdownParser.__parse_to_markdown(token[21], true)
                }
            }
        } else if (token[22]) { // image tag
            element = {
                type:"image-tag",
                data:{
                    url:token[22]
                }
            }
        } else if (token[23] || token[24]) { // strong, strike, bold, italic, code, sub, and sup tag
            element = {
                type:(token[23] || token[24]) + "-tag" + (token[23] ? "-begin" : "-end"),
                data:{
                    /* no data */
                }
            }

            if (token[23]) {
                begin_tags.push(element);
            } else {
                MarkdownParser.__handle_mismatched_tags(elements, token[24], begin_tags);
            }
        } else if (token[25]) { // start of div tag
            var klass = token[25].match(/class=\"([^"]+)\"/);

            element = {
                type:"div-tag-begin",
                data:{
                    class:klass ? klass[1] : ""
                }
            }

            begin_tags.push(element);
        } else if (token[26]) { // end of div tag
            element = {
                type:"div-tag-end",
                data:{
                    /* no data */
                }
            }

            MarkdownParser.__handle_mismatched_tags(elements, "div", begin_tags);
        } else if (token[27] || token[28]) { // paragraph tag
            element = {
                type:"paragraph-tag" + (token[27] ? "-begin" : "-end"),
                data:{
                    /* no data */
                }
            }

            if (token[27]) {
                begin_tags.push(element);
            } else {
                MarkdownParser.__handle_mismatched_tags(elements, "paragraph", begin_tags);
            }
        } else if (token[29] || token[30]) { // blockquote tag
            element = {
                type:"blockquote-tag" + (token[29] ? "-begin" : "-end"),
                data:{
                    /* no data */
                }
            }

            if (token[29]) {
                begin_tags.push(element);
            } else {
                MarkdownParser.__handle_mismatched_tags(elements, "blockquote", begin_tags);
            }
        } else if (token[31] || token[32]) { // center tag
            element = {
                type:"center-tag" + (token[31] ? "-begin" : "-end"),
                data:{
                    /* no data */
                }
            }

            if (token[31]) {
                begin_tags.push(element);
            } else {
                MarkdownParser.__handle_mismatched_tags(elements, "center", begin_tags);
            }
        } else if (token[33]) { // br tag
            element = {
                type:"br-tag",
                data:{
                    /* no data */
                }
            }
        } else if (token[34]) { // hr tag
            element = {
                type:"hr-tag",
                data:{
                    /* no data */
                }
            }
        } else if (token[35]) { // unhandled tag
            element = {
                type:"tag",
                data:{
                    /* no data */
                }
            }
        } else if (token[36]) { // inline formatting: *em*, **strong**, ...
            var symbol = token[36] ? token[36][0] : "";

            if (symbol === "*" || symbol === "_" || symbol === "~") {
                var formatter_begin = MarkdownParser.__last_formatter_begin(elements, symbol);

                if (formatter_begin) {
                    var length = Math.min(formatter_begin.data["text"].length, token[36].length);
                    var type = (symbol === "~") ? "linethrough" : (length == 3) ? "em-italic" : (length == 2) ? "em" : "italic";

                    formatter_begin["type"] = type + "-begin";
                    formatter_begin.data["prior"] = formatter_begin.data["text"].substring(0, token[36].length - length);

                    element = {
                        type:type + "-end",
                        data:{
                            trailing:token[36].substring(0, formatter_begin.data["text"].length - length)
                        }
                    }
                } else {
                   element = {
                        type:"formatter-begin",
                        data:{
                            text:token[36]
                        }
                    }
                }
            } else {
                element = {
                    type:"break",
                    data:{
                        text:token[36]
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
    MarkdownParser.__handle_mismatched_tags(elements, "", begin_tags);

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

MarkdownParser.__handle_mismatched_tags = function(elements, tag, begin_tags) {
    while (begin_tags.length > 0) {
        var last_begin_tag = begin_tags.pop();

        if (tag && last_begin_tag.type.startsWith(tag)) {
            break;
        }

        elements.push({
            type:last_begin_tag.type.split("-")[0] + "-tag-end"
        });
    }
}

__MODULE__ = MarkdownParser;

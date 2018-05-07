MarkdownParser = (function() {
    return {};
})();

MarkdownParser.parse = function(text) {
    console.log(text);
    var tokenizer = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^```(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:\!\[([^\]]*?)\]\(([^\)]+?)\))|(\[)|(\](?:\(([^\)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(\-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,3})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*])/gm;
    var data = [];
    var prev_chunk, chunk, element;
    var last_index  = 0;

    while ((token = tokenizer.exec(text))) {
        prev_chunk = text.substring(last_index, token.index);
        chunk = token[0];

        if (prev_chunk.match(/[^\\](\\\\)*\\$/)) { // escaped
            console.log("escaped: " + prev_chunk + chunk);
            element = {

            }
        } else if (token[3] || token[4]) { // code/indent blocks
            element = {
                type:"code",
                data:{
                    text:this.__outdent(token[3] || token[4]).replace(/^\n+|\n+$/g, '')
                }
            }
        } else if (token[6]) { // > quotes, -* lists
            element = {
                type:""
            }
        } else if (token[8]) { // images
            element = {
                type:"image",
                data:{
                    url:token[11]
                }
            }
        } else if (token[10]) { // links
            element = {

            }
        } else if (token[9]) {
            element = {

            }
        } else if (token[12] || token[14]) { // headings
            element = {

            }
        } else if (token[16]) { // `code`
            element = {
                type:"code",
                data:{
                    text:token[16]
                }
            }
        } else if (token[17] || token[1]) { // inline formatting: *em*, **strong**, ...
            element = {

            }
        }
        console.log(prev_chunk);
        console.log("<<<<<<<<<");
        console.log(chunk);
        console.log(">>>>>>>>>");

        last_index = tokenizer.lastIndex;
    }

    return data;
}

MarkdownParser.__outdent = function (str) {
    return str.replace(RegExp('^'+(str.match(/^(\t| )+/) || '')[0], 'gm'), '');
}

__MODULE__ = MarkdownParser;

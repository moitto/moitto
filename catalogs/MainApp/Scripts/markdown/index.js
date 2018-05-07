Markdown = (function() {
    return {};
})();

Markdown.parser = include("./parser.js");

// class MarkdownModel

function MarkdownModel(data) {
    this.data = data;
}

// instance factory

Markdown.parse = function(text) {
    return new MarkdownModel(Markdown.parser.parse(text));
}

__MODULE__ = Markdown;

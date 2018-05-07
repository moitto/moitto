function Theme(theme) {
    ThemeBase.call(this, theme);
}

Theme.prototype = Object.create(ThemeBase.prototype);
Theme.prototype.constructor = Theme;

Theme.prototype.build_body = function(body, format) {
    if (format === "markdown") {
        return this.markdown_to_sbml(this.parse_markdown(body));
    }

    return body;
}

Themes = (function() {
    return {};
})();

Themes.markdown = require("markdown");

// class ThemeBase

function ThemeBase(theme) {
    this.theme = theme;
    this.dir_path = "~/Themes/" + theme;
    this.hides_navibar = false;
}

ThemeBase.prototype.parse_markdown = function(text) {
    return Themes.markdown.parse(text);
}

ThemeBase.prototype.markdown_to_sbml = function(model) {
     var sbml = "";

    return sbml;
}

// instance factory

Themes.create = function(theme) {
    include("~/Themes/" + theme + "/theme.js");

    return new Theme(theme);
}

__MODULE__ = Themes;

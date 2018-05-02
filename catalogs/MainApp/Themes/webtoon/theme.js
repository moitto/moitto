include("~/Themes/theme.js");

function Theme() {
	ThemeBase.call();

	this.hides_navibar = true;
}

Theme.prototype = Object.create(ThemeBase.prototype);
Theme.prototype.constructor = Theme;

Theme.prototype.build_body = function(body) {
	return body;
}

__MODULE__ = new Theme();

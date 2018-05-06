function Theme(theme) {
	ThemeBase.call(this, theme);

	this.hides_navibar = true;
}

Theme.prototype = Object.create(ThemeBase.prototype);
Theme.prototype.constructor = Theme;

Theme.prototype.build_body = function(body, format) {
	return body;
}

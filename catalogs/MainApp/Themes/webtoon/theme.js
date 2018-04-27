function Theme() {
	ThemeBase.call();
}

Theme.prototype = Object.create(ThemeBase.prototype);
Theme.prototype.constructor = Theme;

Theme.prototype.build_body = function(body) {
	return this.build_sbml(body);
}

function Theme(theme) {
    ThemeBase.call(this, theme);

    this.hides_navibar = true;
}

Theme.prototype = Object.create(ThemeBase.prototype);
Theme.prototype.constructor = Theme;

Theme.prototype.build_body = function(body, format) {
    var title = this.__get_title(body);

    if (title) {
        this.auxiliary["title"] = title;
    }

    this.auxiliary["video-id"] = this.__get_video_id(body);

    return body;
}

Theme.prototype.__get_title = function(text) {
}

Theme.prototype.__get_video_id = function(text) {
   return "9kl0bsl5FZo";
}

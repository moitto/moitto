function Theme(theme) {
    ThemeBase.call(this, theme);

    this.musics    = [];
    this.image_url = "";

    this.hides_navibar = true;
}

Theme.prototype = Object.create(ThemeBase.prototype);
Theme.prototype.constructor = Theme;

Theme.prototype.build_body = function(body, format, images) {
    var model = this.parse_markdown(body);

    this.musics    = Theme.__get_musics(model);
    this.image_url = Theme.__get_image_url(model);

    return this.markdown_to_sbml(model, images);
}

Theme.prototype.get_custom_text = function() {
    return JSON.stringify({
        "musics":this.musics,
        "image-url":this.image_url
    });
}

/* helper functions */

Theme.__get_musics = function(model) {
    var musics = [];

    model.elements.forEach(function(element) {
        if (element.type === "list") {
            element.data["items"].forEach(function(item) {
                var text = "";

                item[2].forEach(function(element) {
                    [ "prior", "text", "trailing" ].forEach(function(property) {
                        if (element.data.hasOwnProperty(property)) {
                            text += element.data[property];
                        }
                    });
                });

                var matched = /(.+)\((.+)\)/.exec(text);

                if (matched) {
                    musics.push({
                        "title":matched[1],
                        "artists":matched[2]
                    })
                }
            });
        }
    });

    return musics;
}

Theme.__get_image_url = function(model) {
    var image_urls = [];

    model.elements.forEach(function(element) {
        if (element.type === "image" || element.type === "image-tag") {
            image_urls.push(Theme.__encode_url(element.data["url"]));
        }
    });

    if (image_urls) {
        return image_urls[0];
    }

    return "";
}

Theme.__encode_url = function(url) {
    url = url.replace(/['"‘’]/g, "");

    return url;
}

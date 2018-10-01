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

    this.musics    = Theme.__get_musics_in_elements(model.elements);
    this.image_url = Theme.__get_image_url_in_elements(model.elements);

    return this.markdown_to_sbml(model, images);
}

Theme.prototype.get_custom_text = function() {
    return JSON.stringify({
        "musics":this.musics,
        "image-url":this.image_url
    });
}

/* helper functions */

Theme.__get_musics_in_elements = function(elements) {
    for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];

        if (element.type === "list") {
            return Theme.__get_musics_in_list(element);
        }
    }

    return [];
}

Theme.__get_musics_in_list = function(list) {
    var musics = [];

    list.data["items"].forEach(function(item) {
        var text = Theme.__get_text_in_elements(item[2]);
        var matched = /(.+)\((.+)\)/.exec(text);

        if (matched) {
            musics.push({
                "title":matched[1],
                "artists":matched[2]
            })
        }
    });

    return musics;
}

Theme.__get_text_in_elements = function(elements) {
    var text = "";

    elements.forEach(function(element) {
        [ "prior", "text", "trailing"].forEach(function(property) {
            if (element.data.hasOwnProperty(property)) {
                text += element.data[property];
            }
        })
    });

    return text;
}

Theme.__get_image_url_in_elements = function(elements) {
    var image_urls = [];

    elements.forEach(function(element) {
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

Books = (function() {
    return {};
})();

Books.steemjs  = require("steemjs");
Books.contents = require("contents");
Books.markdown = require("markdown");
Books.sbml     = require("sbml");
Books.urls     = require("urls");

Books.generate_book = function(author, permlink, handler) {
    Books.steemjs.get_content(author, permlink).then(function(response) {
        if (response) {
            var model = Books.markdown.parse(response["body"], []);
            var chapters = Books.__get_chapters_in_elements(model.elements);
            console.log("chapters: " + JSON.stringify(chapters));
            var title = Books.__get_title_in_elements(model.elements) || response["title"];
            var item = author + "-" + permlink;
 
            Books.__generate_book(item, title, author, "ko", chapters, function(response) {
                if (response) {
                    controller.action("import", { "item":item });
    
                    handler(item);
                } else {
                    handler();
                }
            });
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
}

Books.open_book = function(author, permlink) {
    var item = author + "-" + permlink;
    var path = "Books" + "/" + item + "/" + "book.bon";

    if (exist("library", path)) {
        controller.action("open", { "item":item });
    
        return true;
    }

    return false;
}

Books.has_valid_book = function(author, permlink) {
    var item = author + "-" + permlink;
    var path = "Books" + "/" + item + "/" + "book.bon";

    if (exist("library", path)) {
        return true;
    }

    return false;
}

Books.__generate_book = function(item, title, author, language, chapters, handler) {
    var promises = [];

    chapters.forEach(function(chapter) {
        promises.push(Books.steemjs.get_content(chapter["author"], chapter["permlink"]));
    });

    Promise.all(promises).then(function(response) {
        for (var i = 0; i < chapters.length; ++i) {
            chapters[i]["content"] = Books.contents.create(response[i]);
        }

        Books.__write_book_bon(item, title, author, language);
        Books.__write_chapters_sbml(item, title, chapters);
        Books.__copy_template_files(item);

        handler(response);
    }, function(reason) {
        handler();
    });
}

Books.__write_book_bon = function(item, title, author, language) {
    var path = "Books" + "/" + item + "/" + "book.bon";
    var text = read("catalog@resource", "~/Templates/book/book.bon", {
        "TITLE":title,
        "AUTHOR":author,
        "LANGUAGE":language
    });

    write("library", path, text);
}

Books.__write_chapters_sbml = function(item, title, chapters) {
    var path = "Books" + "/" + item + "/" + "chapters.sbml";
    var author = Books.__get_author_in_chapters(chapters);
    var cover_color = Books.__get_cover_color();
    var chapters_text = "";

    chapters.forEach(function(chapter) {
        var content = chapter["content"];
        var title = (chapter["title"] || content.data["title"]).replace("\"", "\\\"");
        var model = Books.markdown.parse(content.data["body"], []);
        var images = Books.__get_image_elements(model.elements);

        if (images) {
            Books.__download_images(item, images);
        }

        chapters_text += read("catalog@resource", "~/Templates/book/chapter.tmpl.sbml", {
            "TITLE":title,
            "BODY":Books.sbml.generate_from_markdown(model, content.meta["image"])
        });
    });

    var text = read("catalog@resource", "~/Templates/book/chapters.sbml", {
        "TITLE":title,
        "AUTHOR":author,
        "COVER-COLOR":cover_color[0],
        "COVER-TEXT-COLOR":cover_color[1],
        "CHAPTERS":chapters_text
    });
    
    write("library", path, text);
}

Books.__copy_template_files = function(item) {
    [ "chapters.sbss", "markdown.sbss", "themes.sbss" ].forEach(function(file) {
        var path = "Books" + "/" + item + "/" + file;
        var text = read("catalog@resource", "~/Templates/book/" + file);

        if (text) {
            write("library", path, text);
        }
    });
}

Books.__download_images = function(item, images) {
    images.forEach(function(element) {
        var url = Books.__encode_url(Books.__url_for_image(element.data["url"]));
        var extension = Books.urls.get_path_extension(url) || "jpg";
        var filename = encode("hex", hash("md5", url)) + "." + extension;
        var path = "Books" + "/" + item + "/" + "Images" + "/" + filename;

        download(url, "library", path);

        if (Books.__is_block_image(image("library", path))) {
            element.data["inline"] = false;
        }

        element.data["filename"] = filename;
    });
}

Books.__get_image_elements = function(elements) {
    var images = [];

    elements.forEach(function(element) {
        if (element.data.hasOwnProperty("elements")) {
            urls = urls.concat(Books.__get_image_elements(element.data["elements"]))
        } else if (element.data.hasOwnProperty("items")) {
            urls = urls.concat(Books.__get_image_elements(element.data["items"]))
        } else {
            if (element.type === "image" || element.type === "image-tag") {
                images.push(element);
            }
        }
    });

    return images;
}

Books.__is_block_image = function(image) {
    return false;
}

Books.__encode_url = function(url) {
    url = url.replace(/['"‘’]/g, "");

    return url;
}

Books.__url_for_image = function(url, size) {
    return "https://cdn.steemitimages.com/" + (size || "640x0") + "/" + url;
}

Books.__get_cover_color = function() {
    var value = controller.catalog("StyleBank").values("showcase", "backgrounds", "C_COLOR", null, [ 0, 1 ], [ null, "random" ])[0];

    if (value) {
        return [ value["color"], value["text-color"] ] ;
    }

    return [ "$THEME_COLOR_00", "$THEME_COLOR_100" ];
}

Books.__get_chapters_in_elements = function(elements) {
    var chapters = [];

    elements.forEach(function(element) {
        if (element.type === "list") {
            chapters = chapters.concat(
                Books.__get_chapters_in_list(element)
            );
        }
    });

    return chapters;
}

Books.__get_chapters_in_list = function(list) {
    var chapters = [];

    list.data["items"].forEach(function(item) {
        item[2].forEach(function(element) {
            if (element.type === "url" || element.type === "link-begin") {
                var steem_url = Books.urls.parse_steem_url(element.data["url"]);

                if (steem_url && steem_url[2]) {
                    chapters.push({
                        "title":Books.__get_text_in_elements(item[2]),
                        "author":steem_url[1],
                        "permlink":steem_url[2]
                    });
                }
            }
        });
    });

    return chapters;
}

Books.__get_title_in_elements = function(elements) {
    for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];

        if (element.type === "heading") {
            var text = Books.__get_text_in_elements(element.data["elements"]);
            var matched = /\[(.+)\]/.exec(text);

            if (matched) {
                return matched[1];
            }
        }
    }

    return "";
}

Books.__get_author_in_chapters = function(chapters) {
    var authors = [];

    chapters.forEach(function(chapter) {
        if (!authors.includes(chapter["author"])) {
            authors.push(chapter["author"]);
        }
    });

    if (authors.length > 1) {
        return authors[0] + " 외 " + (authors.length - 1).toString() + "명";
    }

    return authors[0];
}

Books.__get_text_in_elements = function(elements) {
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

__MODULE__ = Books;

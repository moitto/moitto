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
            var title = response["title"];
            var item = author + "-" + permlink;

            Books.__generate_book(item, title, author, "ko", Books.__get_discussions(model), function(response) {
                controller.action("import", { "item":item });

                handler(response);
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

    controller.action("open", { "item":item });
}

Books.has_valid_book = function(author, permlink) {
    var item = author + "-" + permlink;
    var path = "Books" + "/" + item + "/" + "book.bon";

    if (exist("library", path)) {
        return true;
    }

    return false;
}

Books.__generate_book = function(item, title, author, language, discussions, handler) {
    var promises = [];

    discussions.forEach(function(discussion) {
        promises.push(Books.steemjs.get_content(discussion["author"], discussion["permlink"]));
    });

    Promise.all(promises).then(function(response) {
        Books.__write_book_bon(item, title, author, language);
        Books.__write_chapters_sbml(item, response);
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

Books.__write_chapters_sbml = function(item, discussions) {
    var path = "Books" + "/" + item + "/" + "chapters.sbml";
    var text = "";

    discussions.forEach(function(discussion) {
        var content = Books.contents.create(discussion);
        var title = content.data["title"].replace("\"", "\\\"");
        var model = Books.markdown.parse(content.data["body"], []);
        var images = Books.__get_image_elements(model.elements);

        if (images) {
            Books.__download_images(item, images);
        }

        text += "=begin chapter: toc=\"" + title + "\", title=\"" + title + "\""+ "\n";
        text += "=begin title"  + "\n";
        text += content.data["title"] + "\n";
        text += "=end title"  + "\n\n";
        text += Books.sbml.generate_from_markdown(model, content.meta["image"]) + "\n";
        text += "=end chapter" + "\n\n";
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

Books.__get_discussions = function(model) {
    var discussions = [];

    model.elements.forEach(function(element) {
        if (element.type === "list") {
            element.data["items"].forEach(function(item) {
                item[2].forEach(function(element) {
                    if (element.type === "url" || element.type === "link-begin") {
                        var steem_url = Books.urls.parse_steem_url(element.data["url"]);

                        if (steem_url && steem_url[2]) {
                            discussions.push({
                                "author":steem_url[1],
                                "permlink":steem_url[2]
                            });
                        }
                    }
                });
            });
        }
    });

    console.log(JSON.stringify(discussions));

    return discussions;
}

__MODULE__ = Books;

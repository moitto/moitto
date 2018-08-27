var __playlist = null;
var __playing_number = 0;

function on_loaded() {
    if (!__playlist) {
        __playlist = JSON.parse($data["custom-text"]);

        __reload_musics();
        __load_title_image();
    }
}

function on_change_data(id, data) {
    view.data("display-unit", { 
        "theme":$data["theme"],
        "hides-navibar":"yes"
    });

    view.action("reload", { "keeps-position":"yes" });
}

function feed_musics(keyword, location, length, sortkey, sortorder, handler) {
    var musics = [];
    var number = 1;

    if (__playlist) {
        __playlist["musics"].forEach(function(music) {
            musics.push({
                "title":music["title"],
                "artists":music["artists"],
                "number":number.toString()
            });

            number = number + 1;
        });
    }

    __playing_number = 1;

    handler(musics);

    timeout(0.1, function() {
        __reload_music_list();
    });
}

function select_music(data) {
    var showcase = view.object("showcase.musics");

    __playing_number = parseInt(data["number"]);

    showcase.action("focus", { "number":__playing_number.toString() });
    controller.action("hide", { "group":"music.list" });
}

function prev_music() {
    var showcase = view.object("showcase.musics");

    if (__playing_number == 1) {
        __playing_number = __playlist["musics"].length;
    } else {
        __playing_number = __playing_number - 1;
    }

    showcase.action("focus", { "number":__playing_number.toString() });
}

function next_music() {
    var showcase = view.object("showcase.musics");

    if (__playing_number == __playlist["musics"].length) {
        __playing_number = 1;
    } else {
        __playing_number = __playing_number + 1;
    }

    showcase.action("focus", { "number":__playing_number.toString() });
}

function shuffle_music() {
    var showcase = view.object("showcase.musics");

    __playlist["musics"].sort(function() {
        return (Math.random() > 0.5) ? 1 : -1;
    });

    showcase.action("reload");
}

function open_discussion() {
    view.data("display-unit", { 
        "theme":"default",
        "hides-navibar":"no"
    });

    controller.action("page", {
        "display-unit":"S_DISCUSSION",
        "target":"popup",
        "alternate-name":"discussion",
        "dir-path":"~/Themes/default"
    }); 
}

function vote() {
    if (storage.value("ACTIVE_USER")) {
        var value = view.data("display-unit");

        if (parseInt(value["vote-weight"]) == 0) {
            controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.UPVOTE", {
                "author":$data["author"],
                "permlink":$data["permlink"]
            });

            controller.action("popup", { "display-unit":"S_DISCUSSION.UPVOTE" });
        } else {
            controller.catalog().submit("showcase", "auxiliary", "S_DISCUSSION.UNVOTE", {
                "author":$data["author"],
                "permlink":$data["permlink"]
            });

            controller.action("popup", { "display-unit":"S_DISCUSSION.UNVOTE" });
        }
    } else {
        controller.action("subview", { 
            "subview":"V_LOGIN", 
            "target":"popup",
            "close-popup":"yes" 
        });
    }
}

function __reload_musics() {
    var showcase = view.object("showcase.musics");

    showcase.action("reload");
}

function __reload_music_list() {
    var showcase = view.object("showcase.music.list");

    showcase.action("reload");
}

function __load_title_image() {
    var image = view.object("image.bg");
    var url = __playlist["image-url"];

    image.property({ "image-url":url });
}

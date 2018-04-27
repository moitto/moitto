var playlist = null;

function on_loaded() {
	playlist = {};

	playlist["musics"]      = __fetch_musics_in_content($data["body"]);
	playlist["description"] = __fetch_description_in_content($data["body"]);
	playlist["image-url"]   = __fetch_image_url_in_content($data["body"]);

	__reload_musics();
	__reload_image();
}

function feed_musics(keyword, location, length, sortkey, sortorder, handler) {
	var musics = [];

	if (playlist) {
		musics = playlist["musics"];
	}

	handler(musics);
}

function __reload_musics() {
	var showcase = view.object("showcase.musics");

	showcase.action("reload");
}

function __reload_image() {
	var image = view.object("image.bg");
	var url = playlist["image-url"];

	image.property({"image-url":url});
}

function __fetch_musics_in_content(body) {
	var pattern = /\n\*\s+([^\n]+)\(([^\)]+)\)/g;
	var matched = null;
	var musics = [];

	while (matched = pattern.exec(body)) {
		musics.push({
			"title":matched[1],
			"artists":matched[2]
		});
	}

	return musics;
}

function __fetch_description_in_content(body) {
	return null;
}

function __fetch_image_url_in_content(body) {
	var url = /!\[[^\]]*\]\(([^\)]+)\)/g.exec(body);

	if (url) {
		return url[1];
	}

	return null;
}

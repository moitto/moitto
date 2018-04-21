function YouTube() {}

YouTube.prototype.search_music = function(title, artist, handler) {
	var query = (title + " " + artist).replace(/#/g, "").replace(/ /g, "+");
	var url = "https://www.youtube.com/results?search_query=" + query;

	fetch(url).then(function(response) {
		if (response.ok) {
			response.text().then(function(text) {
				handler(this.__search_music_in_html(text));
			});
		}
	});
}

YouTube.prototype.__search_music_in_html = function(html) {
	var items = [];
	var ol = html.match(/<ol[^>]+item-section[^>]+>([\r\n]|.)*?<\/ol>/g)[0];
	var pattern = /data-context-item-id="(.*?)"/g;
	var matched = null;

	while (matched = pattern.exec(ol)) {
		items.push(matched[1]);
	}

	return items;
}

YouTube.prototype.version = function() {
	return "1.0";
}

__MODULE__ = new YouTube();

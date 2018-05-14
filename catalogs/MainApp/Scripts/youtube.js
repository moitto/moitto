YouTube = (function() {
    return {};
})();

YouTube.search_musics = function(title, artist, handler) {
    var url = "https://www.youtube.com/results";
    var query = "search_query=" + (title + " " + artist).replace(/#/g, "").replace(/ /g, "+");

    fetch(url + "?" + query).then(function(response) {
        if (response.ok) {
            response.text().then(function(text) {
                handler(YouTube.__search_musics_in_html(text));
            });
        }
    }, function(reason) {
        hanlder();
    });
}

YouTube.__search_musics_in_html = function(html) {
    var items = [];
    var ol = html.match(/<ol[^>]+item-section[^>]+>([\r\n]|.)*?<\/ol>/g)[0];
    var pattern = /data-context-item-id="(.*?)"/g;
    var matched = null;

    while (matched = pattern.exec(ol)) {
        items.push(matched[1]);
    }

    return items;
}

YouTube.version = function() {
    return "1.0";
}

__MODULE__ = YouTube;

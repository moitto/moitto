function feed_apps(keyword, location, length, sortkey, sortorder, handler) {
    var url = "https://moitto.io/api/channel/" + $data["channel"];
    var query = "location=" + location + "&" + "length=" + length;

    fetch(url + "?" + query, null, true).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                handler(data);
            });
        } else {
            handler([]);
        }
    }); 
}

function select_app(data) {
    controller.action("app", {
        "app":data["app"],
        "version":data["version"],
        "url":data["file"]
    });
}

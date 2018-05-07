var $BASEURL = "https://jampod-156205.appspot.com/api/v1";

function feed_jam(keyword, location, length, sortkey, sortorder, handler) {
    var url = $BASEURL + "/channel/" + $data["channel"];

    if (location == 0) {
        fetch(url, null, true).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    handler(data);
                });
            } else {
                handler([]);
            }
        });    
    } else {
        handler([]);
    }
}

function select_jam(data) {
    controller.action("app", {
        "app":data["app"],
        "version":data["version"],
        "url":data["file"]
    });
}

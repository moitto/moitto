var $BASEURL = "https://jampod-156205.appspot.com/api/v1";

function feed_jam(keyword, location, length, sortkey, sortorder, handler) {
    var query = "location=" + location + "&" + "length=" + length;
    var url = $BASEURL + "/store" + "?" + query;
    var cached = __cached_data();

    if (cached.length > location) {
    	var last = location + Math.min(cached.length - location, length);
        
        if (last > location) {
            handler(cached.slice(location, last));
        } else {
            handler([]);
        }
    } else {
        fetch(url, null, true).then(function(response) {
           	if (response.ok) {
               	response.json().then(function(data) {
              		handler(data);
                    
                   	__cache_data(cached.concat(data));
               	});
           	} else {
               	handler([]);
           	}
       	});	
    }
}

function reset_jam() {
    var data = document.value("data.store");
    
    if (data) {
        document.value("data.store.at", Date.now() - 3600 * 1000);
    }
}

function select_jam(data) {
    controller.action("app", {
        "app":data["app"],
        "version":data["version"],
        "url":data["file"]
    });
}

function __cached_data() {
    var data = document.value("data.store");
    
    if (data) {
        var interval = Date.now() - document.value("data.store.at");
        
        if (interval < 3600 * 1000) { /* 1 hour */
            return data;
        }
    }
    
    return [];
}

function __cache_data(data) {
    document.value("data.store", data);
    document.value("data.store.at", Date.now());
}

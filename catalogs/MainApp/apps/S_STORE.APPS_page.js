function feed_apps(keyword, location, length, sortkey, sortorder, handler) {
    var url = "https://moitto.io/api/store";
    var query = "location=" + location + "&" + "length=" + length;
    var cached = __cached_data();

    if (cached.length > location) {
    	var last = location + Math.min(cached.length - location, length);
        
        if (last > location) {
            handler(cached.slice(location, last));
        } else {
            handler([]);
        }
    } else {
        fetch(url + "?" + query, null, true).then(function(response) {
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

function reset_apps() {
    var data = document.value("data.store");
    
    if (data) {
        document.value("data.store.at", Date.now() - 3600 * 1000);
    }
}

function select_app(data) {
    controller.action("app", {
        "app":data["app"],
        "version":data["version"],
        "url":data["file-url"]
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

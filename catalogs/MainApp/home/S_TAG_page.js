var global = require("global");

function on_loaded() {
    var user = controller.catalog().value("showcase", "auxiliary", "S_TAG");

    global.get_user(user["username"]).then(function(user) {
        var data = {
            "fetched":"yes"
        };

        view.data("display-unit", data);
        view.action("reload");
    });
}

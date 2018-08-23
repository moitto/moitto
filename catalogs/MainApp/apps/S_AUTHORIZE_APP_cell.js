var users = require("users");
var apps  = require("apps");

function authorize() {
    var value = controller.catalog().value("showcase", "auxiliary", "S_AUTHORIZE_APP");

    apps.authorize_app(value["app-id"]);
    
    controller.action("script", {
        "script":value["return-script"],
        "subview":value["return-subview"],
        "request-id":value["request-id"]
    });

    controller.action("subview-back");
}

function show_owner() {
    var user = users.create($data["owner"]);

    controller.catalog().submit("showcase", "auxiliary", "S_USER", {
        "username":user.name,
        "userpic-url":user.get_userpic_url("small"),
        "fetched":"no"
    });

    controller.action("page", { "display-unit":"S_USER", "target":"popup" })
}

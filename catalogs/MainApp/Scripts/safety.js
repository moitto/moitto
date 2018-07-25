Safety = (function() {
    return {};
})();

Safety.settings = require("settings");

Safety.get_disallowed_tags = function() {
    var tags = [];

    if (!Safety.settings.nsfw_contents_allowed()) {
        var values = controller.catalog().values("showcase", "nsfw.tags", null, null, [ 0, 100 ]);

        values.forEach(function(value) {
            tags.push(value["tag"]);
        });
    }

    return tags;
}

__MODULE__ = Safety;

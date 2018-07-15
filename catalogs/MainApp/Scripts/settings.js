Settings = (function() {
    return {};
})();

Settings.allow_nsfw_contents = function() {
    storage.value("NSFW_ALLOWED", true);
}

Settings.disallow_nsfw_contents = function() {
    storage.value("NSFW_ALLOWED", false);
}

Settings.nsfw_contents_allowed = function() {
    return storage.value("NSFW_ALLOWED");
}

Settings.set_refresh_interval = function(interval) {
    storage.value("REFRESH_INTERVAL", interval);
}

Settings.get_refresh_interval = function() {
    return storage.value("REFRESH_INTERVAL") || 60 * 1000; // 1 hour
}

__MODULE__ = Settings;

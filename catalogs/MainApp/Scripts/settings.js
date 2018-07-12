Settings = (function() {
    return {};
})();

Settings.wallet = require("wallet");

Settings.reset_pin_force = function(handler) {
    Settings.wallet.reset_pin_force(function(pin) {
        handler(pin);
    });
}

Settings.is_pin_registered = function() {
    return Settings.wallet.is_pin_registered();
}

Settings.allow_nsfw_contents = function(handler) {
    Settings.wallet.verify_pin("PIN번호를 입력하면 #NSFW 글을 보이도록 합니다.", function(pin) {
        storage.value("NSFW_ALLOWED", true);
        
        handler();
    });
}

Settings.disallow_nsfw_contents = function(handler) {
    Settings.wallet.verify_pin("PIN번호를 입력하면 #NSFW 글을 보이지 않게 합니다.", function(pin) {
        storage.value("NSFW_ALLOWED", false);

        handler();
    });
}

Settings.nsfw_contents_allowed = function() {
    return storage.value("NSFW_ALLOWED");
}

__MODULE__ = Settings;

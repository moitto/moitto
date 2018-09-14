function on_login() {
    [ "V_HOME", "V_NOTIF", "V_PROFILE" ].forEach(function(subview) {
        controller.action("reload", { "target":"catalog", "subview":subview });
    });
    
    controller.action("script", { 
        "script":"update_notif", 
        "subview":"__MAIN__",
        "routes-to-topmost":"no"
    });
    controller.action("subview-back");
}

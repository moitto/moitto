function on_login() {
    [ "V_HOME", "V_WALLET", "V_NOTIF" ].forEach(function(subview) {
        controller.action("reload", { "target":"catalog", "subview":subview });
    });
    
    controller.action("script", { "script":"update_notif", "subview":"__MAIN__" });
    controller.action("subview-back");
}

function follow() {
    owner.action("script", {
        "script":"follow", 
        "form":"form." + $data["username"]
    });
}

function mute() {
    owner.action("script", {
        "script":"mute", 
        "form":"form." + $data["username"]
    });
}

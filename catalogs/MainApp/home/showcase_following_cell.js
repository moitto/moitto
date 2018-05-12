function unfollow() {
    owner.action("script", {
        "script":"unfollow", 
        "form":"form." + $data["username"]
    });
}

function mute() {
    owner.action("script", {
        "script":"mute", 
        "form":"form." + $data["username"]
    });
}

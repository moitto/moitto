function update_vote() {
    var voted = __is_voted();

    __update_vote_button(voted);
}

function __update_vote_button(voted) {
    var button = view.object("btn.vote");

    button.property({
        "selected":voted ? "yes" : "no"
    });
}

function __is_voted() {
    var data = view.data("display-unit");

    if (data.hasOwnProperty("voted") && data["voted"] === "yes") {
        return true;
    }    

    return false;
}

function on_change_data(data) {
   if (data.hasOwnProperty("vote-weight")) {
        __update_votes_count_button(parseInt(data["votes-count"]));
        __update_payout_value_button(data["payout-value"]);
    }
}

function __update_votes_count_button(count) {
    var button = view.object("btn.votes.count");

    button.property({ "label":count.toString() });
}

function __update_payout_value_button(value) {
    var button = view.object("btn.payout.value");

    button.property({ "label":" " + value + " " });
}

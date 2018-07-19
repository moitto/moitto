function on_change_data(data) {
    if (data.hasOwnProperty("votes-count")) {
        __update_votes_count_button(parseInt(data["votes-count"]));
    }

    if (data.hasOwnProperty("replies-count")) {
        __update_replies_count_button(parseInt(data["replies-count"]));
    }

    if (data.hasOwnProperty("payout-value")) {
        __update_payout_value_button(data["payout-value"]);
    }
}

function __update_votes_count_button(count) {
    var button = view.object("btn.votes.count");

    button.property({ "label":count.toString() });
}

function __update_replies_count_button(count) {
    var button = view.object("btn.replies.count");

    button.property({ "label":count.toString() });
}

function __update_payout_value_button(value) {
    var button = view.object("btn.payout.value");

    button.property({ "label":" " + value + " " });
}

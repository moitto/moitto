function show_replies() {
    controller.catalog().submit("showcase", "auxiliary", "S_REPLIES", {
        "author":$data["author"],
        "permlink":$data["permlink"]
    });

    controller.action("page", { "display-unit":"S_REPLIES" })
}

function vote() {
    __freeze_vote_button();

}

function __freeze_vote_button() {
    var button = view.object("btn.vote");

    button.property({ "enabled":"no" });
}

function __unfreeze_vote_button() {
    var button = view.object("btn.vote");

    button.property({ "enabled":"yes" });
}

function __select_vote_button() {
    var button = view.object("btn.vote");

    button.property({ "selected":"yes" });
}

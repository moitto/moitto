Quests = (function() {
    return {};
})();

Quests.account = require("account");

Quests.start_quest = function(author, permlink, handler) {
    var quest_id = "S_QUEST_" + author + "-" + permlink;
    var value = controller.catalog().value("showcase", "quests", quest_id);
    var started_at = new Date();

    if (!value || !value["started-at"] || value["finished-at"]) {
        controller.catalog().submit("showcase", "quests", quest_id, {
            "id":"S_QUEST_" + quest_id,
            "started-at":started_at.toString()
        });
        controller.action("toast", { "message":"퀘스트를 시작합니다." });

        handler();
    } else {
        controller.action("toast", { "message":"이미 진행 중인 퀘스트입니다." });

        handler();
    }
}

Quests.finish_quest = function(author, permlink, comment, handler) {
    var quest_id = "S_QUEST_" + author + "-" + permlink;
    var value = controller.catalog().value("showcase", "quests", quest_id);
    var finished_at = new Date();

    if (value && value["started-at"] && !value["finished-at"]) {
        value = Object.assign(value, { "finished-at":finished_at.toString() });

        controller.catalog().submit("showcase", "quests", quest_id, value);
        controller.action("freeze", { "message":"기록 중..." });

        Quests.__comment_with_result(author, permlink, Quests.__result_body(value, comment), function(response) {
            controller.action("unfreeze");

            if (response) {
                controller.action("toast", { "message":"퀘스트가 완료되었습니다." });
            } else {
                controller.action("alert", { 
                    "message":"죄송합니다. 퀘스트 결과를 기록하지 못했습니다." 
                });
            }
  
            handler();
        });
    } else {
        controller.action("alert", { "message":"퀘스트가 진행되지 않았습니다." });
        
        handler();
    }
}

Quests.is_finished_quest = function(author, permlink) {
    var quest_id = "S_QUEST_" + author + "-" + permlink;
    var value = controller.catalog().value("showcase", "quests", quest_id);

    if (value && value["finished-at"]) {
        return true;
    }

    return false;
}

Quests.__comment_with_result = function(author, permlink, body, handler) {
    var quest_permlink = Quests.__quest_permlink(author, permlink);
    var username = storage.value("ACTIVE_USER");
    var json_metadata = JSON.stringify({});
    var max_accepted_payout = "1000000.000 SBD";
    var percent_steem_dollars = 10000;
    var beneficiaries = [
        { "account": username, "weight": 7000 },
        { "account": author,   "weight": 2100 },
        { "account": "moitto", "weight":  900 }
    ];

    Quests.account.comment(author, permlink, quest_permlink, "", body, json_metadata, function(response) {
        if (response) {
                Quests.account.set_comment_options(quest_permlink, 
                                                   max_accepted_payout,
                                                   percent_steem_dollars,
                                                   true, // allow_votes
                                                   true, // allow_curation_rewards
                                                   beneficiaries, function(response) {
                    if (response) {
                        handler(response);
                    } else {
                        handler();
                    }
                });
        } else {
            handler();
        }
    });
}

Quests.__result_body = function(value, comment) {
    return comment + "\n\n" + "****" + "\n"
            + "<sub>" + "퀘스트 시작시간: " + value["started-at"] + "</sub>" + "\n"
            + "<sub>" + "퀘스트 종료시간: " + value["finished-at"] + "</sub>" + "\n"
            + "<sub>" + "퀘스트 참여코드: " + Quests.__quest_code(value, comment) + "</sub>";
}

Quests.__quest_code = function(value, comment) {
    var message = value["id"] 
                + storage.value("ACTIVE_USER")
                + comment
                + value["started-at"] 
                + value["finished-at"];

    return encode("hex", hash("md5", message)); // Not safe. TBD
}

Quests.__quest_permlink = function(author, permlink) {
    return "quest-" + author + "-" 
            + permlink.replace(/-[0-9]{8}t[0-9]{9}z$/, "") + "-" 
            + new Date().toISOString().replace(/[.:\-]/g, "").toLowerCase();
}

__MODULE__ = Quests;

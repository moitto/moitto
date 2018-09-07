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

        Quests.account.comment(author, permlink, null, "", Quests.__result_body(value, comment), JSON.stringify({}), function(response){
            controller.action("unfreeze");
            controller.action("toast", { "message":"퀘스트가 완료되었습니다." });

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

Quests.__comment_options = function(author) {
    var username = storage.value("ACTIVE_USER");

    return JSON.stringify({
        'allow_votes':true,
        'allow_curation_rewards':true,
        'extensions':[[ 0, {
            'beneficiaries': [
                { 'account': username, 'weight': 7000 },
                { 'account': author,   'weight': 2100 },
                { 'account': 'moitto', 'weight':  900 }
            ]}
        ]]
    });
}

__MODULE__ = Quests;

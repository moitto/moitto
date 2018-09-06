Quests = (function() {
    return {};
})();

Quests.account = require("account");

Quests.start_quest = function(author, permlink, handler) {
    var quest_id = "S_QUEST_" + author + "-" + permlink;
    var started_at = new Date();

    if (!controller.catalog().value("showcase", "quests", quest_id)) {
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
    var finished_at = new Date();
    var value = Object.assign(controller.catalog().value("showcase", "quests", quest_id), {
        "finished-at":finished_at.toString()
    });
    
    controller.catalog().submit("showcase", "quests", quest_id, value);
    controller.action("freeze", { "message":"기록 중..." });

    Quests.account.comment(author, permlink, null, "", Quests.__result_body(value, comment), {}, function(response){
        controller.action("unfreeze");
        controller.action("toast", { "message":"퀘스트가 종료되었습니다." });

        handler();
    });
}

Quests.__result_body = function(value, comment) {
    return comment + "\n\n" + "****" + "\n" +
            + "<sub>" + "퀘스트 시작시간: " + value["started-at"] + "</sub>" +
            + "<sub>" + "퀘스트 종료시간: " + value["finished-at"] + "</sub>" +
            + "<sub>" + "퀘스트 참여코드: " + Quests.__quest_code(value) + "</sub>";
}

Quests.__quest_code = function(value) {
    var signature = value["id"] + Quests.account.get_username() 
                  + value["started-at"] + value["finished-at"];

    return encode("hex", hash("md5", signature)); // Not safe. TBD
}

__MODULE__ = Quests;

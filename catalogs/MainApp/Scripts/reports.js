Reports = (function() {
    return {};
})();

Reports.report_content = function(author, permlink, reason, handler) {
    var reporter = storage.value("ACTIVE_USER") || "";
    var url = "https://moitto.io/api/reports/post";

    fetch(url, {
        "method":"PUT",
        "body":JSON.stringify({
            "reporter":reporter,
            "author":author,
            "permlink":permlink,
            "reason":reason
        })
    }).then(function(response) {
        if (response.ok) {
            handler(response);
        } else {
            handler();
        }
    }, function(reason) {
        handler();
    });
}

__MODULE__ = Reports;

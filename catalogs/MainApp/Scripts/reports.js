Reports = (function() {
    return {};
})();

Reports.report_content = function(author, permlink, reason, handler) {
    var reporter = storage.value("ACTIVE_USER") || "";
    var url = "https://moitto.io/api/reports/" + author + "/" + permlink;

    fetch(url, {
        "method":"POST",
        "body":JSON.stringify({
            "reporter":reporter,
            "author":author,
            "permlink":permlink,
            "reason_code":reason
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

Reports = (function() {
    return {};
})();

Reports.report_content = function(author, permlink, reasons, handler) {
    var reporter = storage.value("ACTIVE_USER") || "";
    var url = "https://moitto.io/api/reports/post";

    fetch(url, {
        "method":"PUT",
        "body":JSON.stringify({
            "reporter":reporter,
            "author":author,
            "permlink":permlink,
            "reasons":reasons
        })
    }).then(function(response) {
        handler(response);
    }, function(reason) {
        handler();
    });
}

__MODULE__ = Reports;

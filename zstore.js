// run this as a content script after fully loading web.whatsapp.com
// or execute this in the developer tools javascript console
// to find and set the global variable ZStore to the whatsapp API.

!function() {
    for (var t of document.getElementsByTagName("script")) t.src.indexOf("/app.") > 0 && fetch(t.src, {
        method: "get"
    }).then(function(t) {
        return t.text().then(function(t) {
            var e = t.indexOf('var a={};t["default"]') - 89;
            window.ZStore = window.webpackJsonp([], null, JSON.stringify(t.substr(e, 10))).default;
        });
    });
}();

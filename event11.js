
$(document).mouseup(function () {
    getselecttext();
});

function getselecttext() {
    var t = '';
    if (window.getSelection) {
        t = window.getSelection();
    } else if (document.getSelection) {
        t = document.getSelection();
    } else if (window.document.selection) {
        t = window.document.selection.createRange().text;
    }
    if (t != '') {
        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;

        chrome.runtime.sendMessage({
            text: String(t)
        }, function (response) {
            console.log(response.farewell);
        });

    }
}

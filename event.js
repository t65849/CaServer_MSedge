$(document).mouseup(function () {
    getselecttext();
});

function getselecttext() {
    var t = '';
    if (window.getSelection && window.getSelection() != '') {
        t = window.getSelection();
    } else if (document.getSelection && document.getSelection() != '') {
        t = document.getSelection();

    } else if (document.activeElement.value.substring(
            document.activeElement.selectionStart,
            document.activeElement.selectionEnd) != '') {
        t = document.activeElement.value.substring(
            document.activeElement.selectionStart,
            document.activeElement.selectionEnd);

    }
    console.log(t)
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;


    browser.runtime.sendMessage({
        text: String(t)
    }, function (response) {
        console.log(response.farewell);
    });


}
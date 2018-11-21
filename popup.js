var stationid = '';
var destinationid = '';
var name = '';
var callid = '';
var caserverurl = '';
var secondcount = 0;

browser.storage.local.get({
    stationid: '',
    destinationid: '',
    name: '',
    caserverurl: ''
}, function (items) {
    stationid = items.stationid;
    $('#destinationid').val(items.destinationid);
    name = items.name;
    caserverurl = items.caserverurl;
    checkStatus(); //一啟動就執行checkStatus
});

$(document).ready(function () {
    $('#makecall').click(function () { //撥出電話
        if ($('#destinationid').val() != '') {
            if (name === '' || stationid === '') {
                alert('你未設定撥號話機，請設定撥號話機');
                browser.tabs.create({
                    url: browser.extension.getURL('options.html')
                });
            } else {
                var destinationid = $('#destinationid').val();
                browser.storage.local.set({
                    destinationid: destinationid,
                }, function () {
                    // Update status to let user know options were saved.
                    checkStatus();
                });
                $.ajax({
                    "async": true,
                    "crossDomain": true,
                    "url": caserverurl + '/makecall', /*https://tstiticctcstest.herokuapp.com/phone*/
                    "method": "POST",
                    headers: {
                        'accept': 'application/json',
                        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
                        'Content-Type': 'application/json',
                        "cache-control": "no-cache"
                    },
                    "processData": false,
                    "data": JSON.stringify({
                        "stationid": stationid,
                        "destinationid": destinationid,
                        "name": name
                    }),
                    success: function (reg) {
                        if (reg.success === false) {
                            $('#showtext').text("撥號失敗");
                            setTimeout(checkStatus, 1000);
                        } else {
                            $('#showtext').text("正在撥號請等候...");
                            //延遲一秒function checkStatus()，因為直接跑會出現結束通話狀態，延遲一秒後才會出現撥號中
                            setTimeout(checkStatus, 1000);
                            callid = reg.callid;
                            return callid;
                        }
                    }, error: function(reg){
                        $('#showtext').text("連線失敗!");
                        //s$('#makecall').trigger('click');
                    }
                });
            }
        } else {
            $('#showtext').text("請輸入號碼");
        }
    })
})

$(document).ready(function () {
    $('#holdcall').click(function () { //保留電話
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": caserverurl + '/holdcall',
            "method": "POST",
            headers: {
                'accept': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
                'Content-Type': 'application/json',
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify({
                "stationid": stationid,
                "callid": callid,
                "name": name
            }),
            success: function (reg) {
                if (reg.success === false) {
                    $('#showtext').text("保留失敗");
                    $('#holdcall').show();
                } else {
                    setTimeout(checkStatus, 1000);
                }
            }
        });
    });
});

$(document).ready(function () {
    $('#retrievecall').click(function () { //接回電話
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": caserverurl + '/retrievecall',
            "method": "POST",
            headers: {
                'accept': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
                'Content-Type': 'application/json',
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify({
                "stationid": stationid,
                "callid": callid,
                "name": name
            }),
            success: function (reg) {
                if (reg.success === false) {
                    $('#showtext').text("接回失敗");
                    $('#retrievecall').show();
                    $('#endcall').show();
                } else {
                    setTimeout(checkStatus, 1000);
                }
            }
        });
    });
});


$(document).ready(function () {
    $('#endcall').click(function () { //結束電話
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": caserverurl + '/endcall',
            "method": "POST",
            headers: {
                'accept': 'application/json',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
                'Content-Type': 'application/json',
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify({
                "stationid": stationid,
                "callid": callid,
                "name": name
            }),
            success: function (reg) {
                if (reg.success === false) {
                    $('#showtext').text("掛斷失敗");
                    $('#endcall').show();
                } else {
                    checkStatus();
                }
            }
        }); //end post ajax
    });
});

function checkStatus() {
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": caserverurl + '/status/' + name + '?stationid=' + stationid,
        "method": "GET",
        headers: {
            'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
            "cache-control": "no-cache"
        },
        success: function (reg) {
            if (reg.success === false) {
                if(reg.message === 'Can not find station status: '+stationid){
                    setTimeout(function(){
                        return checkStatus()
                    },1000);
                    $('#showtext').text("");
                } else {
                    if(secondcount<=10){
                        secondcount++;
                        $('#showtext').text("檢查連線中...");
                        alert(secondcount);
                        //setTimeout(checkStatus,1000);
                        setTimeout(function(){
                            return checkStatus()
                        },1000);
                    }else{
                        $('#showtext').text("連線失敗!");
                    }
                }
            } else {
                var callstatus = reg.status.status;
                callid = reg.status.callid;
                switch (callstatus) {
                    case "oncallconnect": //通話中
                        $('#makecall').hide();
                        $('#holdcall').show();
                        $('#retrievecall').hide();
                        $('#endcall').show();
                        $('#showtext').text("通話中~");
                        setTimeout(checkStatus, 1000);
                        break;
                    case "oncallcreate": //撥號中
                        $('#endcall').show();
                        $('#makecall').hide();
                        $('#showtext').text("撥號中...");
                        setTimeout(checkStatus, 1000);
                        break;
                    case "oncallend": //結束
                        $('#makecall').show();
                        $('#holdcall').hide();
                        $('#retrievecall').hide();
                        $('#endcall').hide();
                        $('#showtext').text("");
                        break;
                    case "oncallhold": //保留中
                        $('#retrievecall').show();
                        $('#holdcall').hide();
                        $('#endcall').show();
                        $('#showtext').text("保留中...");
                        setTimeout(checkStatus, 1000);
                        break;
                    case "oncallring": //響鈴中
                        //do
                        break;
                    default:
                    //do
                }
            }
        }, error: function(reg){
            if(name =='' || stationid == '' || caserverurl == ''){
                //$('#showtext').text("請檢查撥號話機和使用者帳號!");
            }else{
                $('#showtext').text("連線失敗!");
                return checkStatus();
            }
        }
    });
};

$(document).ready(function () {
    $('#dataoption').click(function () {
        browser.tabs.create({
            url: browser.extension.getURL('options.html')
        });
    })
})
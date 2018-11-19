//createMenus();
function genericOnClick(info, tab) {
    var number_destinationid = (info.selectionText ? info.selectionText : ""); //滑鼠選起來的號碼
    number_destinationid = number_destinationid.trim();
    //callout(number_destinationid);
    if(!isNaN(number_destinationid)){
        callout(number_destinationid);
    }else if(number_destinationid.indexOf('(') !== -1 || number_destinationid.indexOf(')') !== -1){
        number_destinationid = number_destinationid.replace('(','').replace(')','').replace('(','').replace(')','');
        callout(number_destinationid);
    }
}

function createMenus() {
    var parent = chrome.contextMenus.create({
        "title": "使用分機撥打電話給Chrome Extension", //撥打分機給%s
        "contexts": ['all'],    
        "onclick": genericOnClick
    });

    // 使用chrome.contextMenus.create的方法回傳值是項目的id
    console.log(parent);
}

function callout(destination){
    chrome.storage.local.get({
        stationid:'',
        destinationid:'',
        name:'',
        caserverurl: ''
    }, function(items) {
        console.log(items.stationid);
        console.log(items.destinationid);
        console.log(items.name);
        var stationid = items.stationid;
        var destinationid = destination;
        var name = items.name;
        var caserverurl = items.caserverurl;
        if(stationid !== '' && name !=='' && caserverurl !==''){
            $.ajax({
                url: caserverurl+'/makecall', //https://tstiticctcstest.herokuapp.com/phone
                headers:{
                    'accept': 'application/json',
                    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*" ,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
                },
                type: 'POST',
                data:JSON.stringify({
                    stationid: stationid,
                    destinationid: destinationid,
                    name: name
                }),
                dataType: 'json',
                success: function (reg) {
                    console.log(JSON.stringify(reg));
                    $('#endcall').toggle();
                    chrome.storage.local.set({ //若成功撥出，儲存選取的號碼
                        destinationid: destinationid,
                    }, function() {
                        // Update status to let user know options were saved.
                    });
                }
            });
        }else{
            alert('你未設定撥號話機，請設定撥號話機');
            chrome.tabs.create({
                url: chrome.extension.getURL('options.html')
            });
        }
    });
};

chrome.runtime.onInstalled.addListener(function () {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            chrome.storage.sync.set({
                text: request.text
            }, function () {
                console.log("The color is green.");
                console.log(sender.tab ?
                    "来自内容脚本：" + sender.tab.url :
                    "来自扩展程序");
                console.log(request.text);
                
                chrome.contextMenus.removeAll(function () {
                    //if (!isNaN(request.text)) {
                    //    createMenus();
                    //}
                    if (request.text === null) {
                        //
                    }else if(isNaN(request.text)){
                        if(request.text.indexOf('-') !== -1){
                            createMenus();
                        }else if(request.text.indexOf('(') !== -1 || request.text.indexOf(')') !== -1){
                            createMenus();
                        }else if(request.text.indexOf(' ') !== -1){
                            createMenus();
                        }
                    }else if(!isNaN(request.text)){
                        createMenus();
                    }
                });

            });
            sendResponse({
                farewell: "已收到"
            });
        });
});

// Saves options to browser.storage
function save_options() {
    var stationid = document.getElementById('stationid').value;
    var caserverurl = document.getElementById('caserverurl').value;
    var name = document.getElementById('name').value;
    var password = document.getElementById('password').value;
    if(caserverurl.slice(-1) == '/'){ //取得最後面的'/'
        var urllength = caserverurl.length;
        caserverurl = caserverurl.slice(0, urllength-1); //去掉url最後面的'/'
        document.getElementById('caserverurl').value = caserverurl;
    }
    if(stationid !== '' && name !=='' && caserverurl !==''){
        getToken(name, password, caserverurl, function (reg) {
            if (reg.success) {
                browser.storage.local.set({
                    stationid: stationid,
                    caserverurl: caserverurl,
                    name: name,
                    password: password,
                    token: reg.token
                }, function () {
                    // Update status to let user know options were saved.
                    alert('已儲存成功');
                    window.open('', '_self', '');
                    window.close();
                    /*var status = document.getElementById('status');
                    status.textContent = '已儲存';
                    setTimeout(function() {
                        status.textContent = '';
                    }, 1500);*/
                });
           } else
                alert(reg.message + "........");
            })
    }else{
        alert('請填寫全部資料');
    }
}
// Restores select box and checkbox state using the preferences stored in browser.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    browser.storage.local.get({
        stationid: '',
        caserverurl: '',
        name: '',
        password: ''
    }, function (items) {
        document.getElementById('stationid').value = items.stationid;
        document.getElementById('caserverurl').value = items.caserverurl;
        document.getElementById('name').value = items.name;
        document.getElementById('password').value = items.password;
    });
}
function getToken(name, password, caserverurl, callback) {
    $.ajax({
        url: String(caserverurl).split('/phone')[0] + '/authenticate', //https://tstiticctcstest.herokuapp.com/phone
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
        },
        type: 'POST',
        data: JSON.stringify({
            "name": name,
            "password": password
        }),
        dataType: 'json',
        success: function (reg) {
            console.log("token資訊: " + JSON.stringify(reg));
            callback(reg);
        },
        error: function (reg) {
            alert("伺服器錯誤..........")
            //return callout(destination);
        }
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
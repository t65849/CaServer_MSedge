$(document).ready(function () {
    $('#cancelAlarm').click(function () {
        if ($('#name').val() != '' && $('#stationid').val() != '' && $('#destinationid').val() != '') {
            /*var data = {
                "stationid": $('#stationid').val(),
                "destinationid": $('#destinationid').val(),
                "name": $('#name').val()
            }*/
            var stationid = $('#stationid').val();
            var destinationid = $('#destinationid').val();
            var name = $('#name').val();
            /*$.post('https://tstiticctcstest.herokuapp.com/phone/makecall', data, function (reg) {
            //$.post('http://127.0.0.1:1337/phone/makecall', data, function (reg) {
                alert(reg.callid);
            })*/
            $.ajax({
                url: 'https://tstiticctcstest.herokuapp.com/phone/makecall',
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
                    alert(JSON.stringify(reg));
                    /*
                    reg.success
                    reg.callid
                    reg.stationid
                    reg.user
                    */ 
                }
            });
        } else {
            alert("請全部輸入");
        }
    })
})
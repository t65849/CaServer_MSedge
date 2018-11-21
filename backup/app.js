var express = require("express");
var fs = require("fs");
var app = express();
var port = /*process.env.PORT ||*/ 1337;
var http = require('http');
var server = http.Server(app).listen(port);
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('pages'));
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    next();
});
app.get("/popup.html", function (req, res) {
    fs.readFile(__dirname + '/popup.html', 'utf8', function (err, data) {
        if (err)
            console.log("檔案讀取錯誤");
        else {
            req.header("Content-Type", 'text/html');
            res.send(data);
        }
    });
});

app.get("/popup.js", function (req, res) {
    fs.readFile(__dirname + '/popup.js', 'utf8', function (err, data) {
        if (err)
            console.log("檔案讀取錯誤");
        else {
            req.header("Content-Type", 'text/javascript');
            res.send(data);
        }
    });
});

app.get("/pages/scripts/jquery/jquery-1.9.0.min.js", function (req, res) {
    fs.readFile(__dirname + '/pages/scripts/jquery/jquery-1.9.0.min.js', 'utf8', function (err, data) {
        if (err)
            console.log("檔案讀取錯誤");
        else {
            req.header("Content-Type", 'text/javascript');
            res.send(data);
        }
    });
});

app.post('/phone/makecall',function(req, res){
    var data = req.body;
    console.log(JSON.stringify(data))
    PostToPhone(data,function(res){
        console.log(res)
    })

})


function PostToPhone(data, callback) {
    //console.log(JSON.stringify(data));
    var options = {
        host: 'tstiticctcstest.herokuapp.com',
        port: '443',
        path: '/phone/makecall',
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkZW1vIiwiaWF0IjoxNTQwNDM0NzI0LCJleHAiOjE1NDMwMjY3MjR9.WGpw02tW_1beq-CWnaF1QhkFcg5PJbWTvcV2t6Cpe5A',
            'Content-Type': 'application/json'
        }
    };
    var https = require('https');
    var req = https.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
        res.on('end', function () {
        });
    });
    req.write(JSON.stringify(data));
    req.end();
    try {
        callback(true);
    } catch (e) { };
}

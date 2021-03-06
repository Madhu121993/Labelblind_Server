"use strict"

require('rootpath')();
var express = require('express')
var bodyparser = require('body-parser')
var cors = require('cors')
var path = require('path')
var fs = require('fs');
var config = require('./config/config');
var session = require('express-session');
var app = express();
app.use(cors())
app.use(bodyparser.json())
app.use('/api/currencyDetails',require('./controllers/controller')); //currency Details
app.use('/api/mail',require('./controllers/controller')); //send mail
app.use('/api/file',require('./controllers/fileOperations.controller')); //upload file
app.use('/Files', express.static(__dirname + '/Files'));//  download file
app.get('/',(req,res)=>{
    res.send('footer')
})

app.get('/get',(req,res)=>{
    console.log("server")
    res.send("send")
})
const port = process.env.PORT || config.port;
app.listen(port);
console.log("Server listening on http://", port);
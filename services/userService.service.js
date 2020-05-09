/**
 * Created By :- Madhu Jha
 * Created Date :- 05--2020 8:18 pm
 * Version :- 1.0
 */

var service = {};
var Q = require('q');
var csvjson = require('csvjson');
var fs = require('fs');
const rp = require('request-promise');
var path = require('path');
var config = require('../config/config')
var currencyConversion = require('./currencyConversion.service')
const sgMail = require('@sendgrid/mail');

service.getUserDetails = getUserDetails;
module.exports = service;


var options = {
    delimiter : ',' , // optional
    quote     : '"' // optional
};

function sendMail(req,res){
    var deffered = Q.defer();
    sgMail.setApiKey('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');
const msg = {
  to: 'krnarvekar@gmail.com',
  from: 'kuldeepnarvekar2017@gmail.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>'
};
// sgMail.send(msg);
// // deffered.resolve({data:"data"})
// // return deffered.promise;
// }

sgMail
  .send(msg)
  .then(() => {}, error => {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  });
}

// Get User Details from DB
function getUserDetails(req,res){
    var fileName = 'Files1.csv'
    var file_data = fs.readFileSync(path.join(__dirname, '../Files/'+fileName), { encoding : 'utf8'});
    var result = csvjson.toObject(file_data, options);
    console.log("requestedData is",result)
    var deffered = Q.defer();
    // var date = new Date();
    // var usdValues = result.map(function(item){
    //     var info = { "Amount:": Number(item.Amount),
    //     "Currency:": item.Currency,
    //     "convertedAmount": item.Amount,
    //     "convertedCurrency": 'USD',
    //     "Date": date
    //    }
    //    return info;
    //        });

    currencyConversion.getCurrencies(req,res).then(function(data) {
        console.log("currencyConversion response:",data["usdValue"])
        var date = new Date();
        var usdValues = result.map(function(item){
            var info = { "Amount:": item.Amount,
            "Currency:": item.Currency,
            "convertedAmount": item.Amount * data["usdValue"],
            "convertedCurrency": 'USD',
            "Date": date
           }
        return info;
        });
        console.log(usdValues);
        var max =  Math.max.apply(Math, usdValues.map(function(o) { 
            return o.convertedAmount;  
        }))
        var min =  Math.min.apply(Math, usdValues.map(function(o) { 
            return o.convertedAmount;  
        }))
        var sum = usdValues.reduce(function (res, item) {
            return res + Number(item.convertedAmount);
          }, 0);

        var average = sum / usdValues.length;
        console.log("Max: ",max,min,sum,average)
        deffered.resolve({usdValues:usdValues,max:max,min:min,sum:sum,average:average});
    })
    .catch(function(err) {
        res.status(400).send(err);
    });
    return deffered.promise;
}

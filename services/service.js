/**
 * Created By :- Madhu Jha
 * Created Date :- 10--2020 1.00 am
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
var nodemailer = require("nodemailer");

service.getConvertedCurrencyValue = getConvertedCurrencyValue;
service.sendEmail = sendEmail;
module.exports = service;


var options = {
    delimiter : ',' , // optional
    quote     : '"' // optional
};

// function sendMail(req,res){
//     var deffered = Q.defer();
//     sgMail.setApiKey('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');
// const msg = {
//   to: 'krnarvekar@gmail.com',
//   from: 'kuldeepnarvekar2017@gmail.com',
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>'
// };
// sgMail
//   .send(msg)
//   .then(() => {}, error => {
//     console.error(error);

//     if (error.response) {
//       console.error(error.response.body)
//     }
//   });
// }

// Get User Details from DB
function getConvertedCurrencyValue(fileName,res){
    var fileName = fileName;
    var file_data = fs.readFileSync(path.join(__dirname, '../Files/'+fileName), { encoding : 'utf8'});
    var result = csvjson.toObject(file_data, options);
   
    var deffered = Q.defer();
    

    currencyConversion.getCurrencies(fileName,res).then(function(data) {
        var date = new Date();
        var usdValues = result.map(function(item){
            var info = { "Amount": item.Amount,
            "Currency": item.Currency,
            "convertedAmount": item.Amount * data["usdValue"],
            "convertedCurrency": 'USD',
            "Date": date
           }
        return info;
        });
        var max =  Math.max.apply(Math, usdValues.map(function(item) { 
            return item.convertedAmount;  
        }))
        var min =  Math.min.apply(Math, usdValues.map(function(item) { 
            return item.convertedAmount;  
        }))
        var sum = usdValues.reduce(function (res, item) {
            return res + Number(item.convertedAmount);
          }, 0);

        var average = sum / usdValues.length;
        var conversionRate = data["usdValue"];
        deffered.resolve({usdValues:usdValues,max:max,min:min,sum:sum,average:average,conversionRate:conversionRate});
    })
    .catch(function(err) {
        res.status(400).send(err);
    });
    return deffered.promise;
}

// send mail through nodeMailer
function sendEmail(req,res){
  var deferred = Q.defer();
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'madhujha121995@gmail.com',
      pass: '7738771111'
    }
  });
  fs.writeFile (path.join(__dirname, '../convertedFiles/input.json'), JSON.stringify(req.body.jsonBody), function(err) {
        if (err) throw err;
        
  var mailOptions = {
    from: 'madhujha121995@gmail.com',
    to: req.body.email,
    subject: req.body.subject,
    text: req.body.body,
    attachments: [{
                  filename: 'input.json',
                  path: path.join(__dirname, '../convertedFiles/input.json')
              }]
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      deferred.resolve(info.response);
    }
  });
})
return deferred.promise;
}
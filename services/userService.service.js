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

service.getUserDetails = getUserDetails;
module.exports = service;


var options = {
    delimiter : ',' , // optional
    quote     : '"' // optional
};

// Get User Details from DB
function getUserDetails(req,res){
    var file_data = fs.readFileSync(path.join(__dirname, '../Files/Files1.csv'), { encoding : 'utf8'});
    var result = csvjson.toObject(file_data, options);
    console.log("requestedData is",result)
    var deffered = Q.defer();
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
        deffered.resolve(usdValues);
    })
    .catch(function(err) {
        res.status(400).send(err);
    });
    return deffered.promise;
}

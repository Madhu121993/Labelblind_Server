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

service.getCurrencies = getCurrencies;
module.exports = service;

function getCurrencies(req,res){
    var deferred = Q.defer();
    var currencyTYpe = 'INR';
    rp({
        method: 'GET',
        uri: 'https://api.exchangeratesapi.io/latest?base=' + currencyTYpe,
        headers: {
            'User-Agent': 'Request-Promise',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (data) {
        var currenciesValues = JSON.parse(data);
        var usdValue = currenciesValues["rates"]["USD"]
        console.log("getCurrencies res: ",usdValue)
        deferred.resolve({usdValue:usdValue});
    })
    return deferred.promise;
}
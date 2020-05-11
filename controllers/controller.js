/**
 * Created By :- Madhu Jha
 * Created Date :- 10--2020 10.38 pm
 * Version :- 1.0
 */

var express = require("express");
var router = express.Router();
var service = require("../services/service");

router.get('/getConvertedCurrencyValue',getConvertedCurrencyValue),
router.post('/sendEmail',sendEmail)
module.exports = router;

/** 
 * @author:Madhu Jha
 * @argument:None
 * @description:Get User Info.
 */
function getConvertedCurrencyValue(req, res) {
    var  fileName = req.query.fileName;
    service.getConvertedCurrencyValue(fileName).then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

/** 
 * @author:Madhu Jha
 * @argument:None
 * @description:Send Email Details.
 */
function sendEmail(req, res) {
    service.sendEmail(req,res).then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}
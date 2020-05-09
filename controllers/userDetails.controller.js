/**
 * Created By :- Madhu Jha
 * Created Date :- 05--2020 8:11 pm
 * Version :- 1.0
 */

var express = require("express");
var router = express.Router();
var userInfoService = require("../services/userService.service");

router.get('/getUserDetails',getUserDetails)
module.exports = router;

/** 
 * @author:Madhu Jha
 * @argument:None
 * @description:Get User Info.
 */
function getUserDetails(req, res) {
    console.log("req in controller",req.query.params);
    console.log("req in controller",req.params);
    userInfoService.getUserDetails(req).then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}
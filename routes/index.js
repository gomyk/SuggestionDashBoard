var express = require('express');
var router = express.Router();
var android_metadata = require("../models/android_metadata");
//var hint_commands_table = require("../models/hint_commands_table");
var log_table = require("../models/log_table");
var logging_data_table = require("../models/logging_data_table");
var remote_data_table = require("../models/remote_data_table");
var room_master_table = require("../models/room_master_table");
var sqlite_sequence = require("../models/sqlite_sequence");

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("test_log");
  //Todo : req.body.logging_data_table is null
  var response = process(req.body.logging_data_table);
  res.render('index', { title: response });
});

router.post('/', function(req, res, next) {
  console.log(JSON.parse(req.body.logging_data_table));

  //Todo : req.body.logging_data_table is null
  var response = process(JSON.parse(req.body.logging_data_table));
  res.render('index', { title: response });
});

async function process(body){
  var response;
  if(body != undefined || body != null || body.length != 0){
    response = save_logging_data_table(body);
    console.log("logging end");
  } else {
    console.log("error : body is empty");
  }
  return response;
}

async function save_logging_data_table(dataArray) {
  if(dataArray == undefined || dataArray == null || dataArray.length == 0){
    return null;
  }
  var response = {};
  await logging_data_table.insertMany(dataArray, function (err, data) {
    if(err) {
      response = {"error" : true, "message" : "Error adding data"};
      console.log("error : "+ data);
    } else {
      response = {"error" : false, "message" : "Data added"};
      console.log("success");
    }
  });
  return response;
}

module.exports = router;

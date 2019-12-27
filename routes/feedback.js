var express = require('express');
var mongoose = require('mongoose');
var Feedback = require('../models/feedback.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.query.q == undefined || req.query.q == null) {
    console.log('query not found error');
    res.send(500, 'query not found');
    return;
  }
  var parsed_query = JSON.parse(req.query.q);
  var selection = null;
  var option = null;
  if(req.query.s != undefined) {
    selection = req.query.s;
  }
  if(req.query.o != undefined) {
    option = JSON.parse(req.query.o);
  }
  if(parsed_query == null) {
    console.log('parsed query is null');
    res.send(500, 'query parse error');
    return;
  }
  if(parsed_query == null) {
    console.log('parsed query is null');
    res.send(500, 'query parse error');
    return;
  }
  Feedback.find(parsed_query, selection, option, function(err , docs) {
    if(err){
      console.log(err);
      res.send(500, err);
      return;
    }
    console.log('OK');
    res.json(docs);
  });
});

router.get('/update', function(req, res, next) {
  if(req.query.q == undefined || req.query.q == null) {
    console.log('query not found error');
    res.send(500, 'query not found');
    return;
  }
  var parsed_query = JSON.parse(req.query.q);
  var selection = null;
  var option = null;
  if(req.query.s != undefined) {
    selection = req.query.s;
  }
  if(req.query.o != undefined) {
    option = JSON.parse(req.query.o);
  }
  if(parsed_query == null) {
    console.log('parsed query is null');
    res.send(500, 'query parse error');
    return;
  }
  Feedback.find(parsed_query, selection, option, function(err , docs) {
    if(err){
      console.log(err);
      res.send(500, err);
      return;
    }
    console.log('OK');
    docs.forEach(doc => {
      var time = doc.session_id.split('_')[0].split(' ');
      var YMD = time[0].split('-');
      var HMS = time[1].split(':');
      var milli = HMS[2].split('.');

      var date = new Date(YMD[0], YMD[1] - 1, YMD[2], HMS[0], HMS[1], milli[0]);

      Feedback.update({_id:doc._id},{timestamp:date.getTime()+milli[1]},function(err,result) {
        if(err){
          console.log("err");
        } else {
          console.log("OK_updated");
        }
      });
    });
  });
});

module.exports = router;

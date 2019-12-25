var express = require('express');
var mongoose = require('mongoose');
var Suggestion = require('../models/suggestion.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.body.query == undefined || req.body.query == null) {
    console.log('query not found error');
    res.send(500, 'query not found');
    return;
  }
  var parsed_query = JSON.parse(req.body.query);
  if(parsed_query == null) {
    console.log('parsed query is null');
    res.send(500, 'query parse error');
    return;
  }
  Suggestion.find(parsed_query, function(err , docs) {
    if(err){
      console.log(err);
      res.send(500, err);
      return;
    }
    console.log('OK');
    res.json(docs);
  });
});

module.exports = router;

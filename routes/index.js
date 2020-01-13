var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var Suggestion = require('../models/suggestion.js');
var Feedback = require('../models/feedback.js');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  //Render Json tree
  if(req.query.path == undefined){
    res.send(500, 'Do not request without query');
  } else {
      if(fs.existsSync('.'+req.query.path)) {
        res.render('index.html',{
          title:"title",
          path:req.query.path,
          link:req.query.link});
      } else {
        res.render('error.html',{
          message:'File not found',
          detail:'It may take some time for a file to be created'});
      }
  }
});

router.post('/', function(req, res, next) {
  var data = req.body.logging_data_table;
  if(data == undefined || data == null){
    console.log("Request error : There is no logging_data_table field in body");
  }
  var parsed_json = null;
  try {
    parsed_json = JSON.parse(data);
  } catch (err){
    console.log(err);
  }

  if(parsed_json == null){
    console.log('Parse data : Json parse error');
    res.send(500,'Parse data : Json parse error');
  } else{
    if(parsed_json.parking_id != undefined) {
      res.send(500, 'Wrong collection');
      console.log('wrong collection');
      return;
    }
    if(parsed_json.bixby_client_version == undefined
      || parsed_json.bixby_client_version == null) {
      //json output
      console.log('Save data : Save analyzed keyword output');
      parsed_json.output = JSON.parse(parsed_json.output);
      saveJsonToFile(parsed_json);
      updateFileExistToDB(parsed_json.filename);
      updateFeedback(parsed_json.filename,'suggestion','fileexist');
      updateFeedback(parsed_json.filename,'feedback','fileexist');
      res.send(200,'Save json complete');
      if(parsed_json.output.length == 0) {
        console.log('Save data : parsed_json is empty');
      } else {
        //sendToLogServer(parsed_json, 'keyword');
      }
    }
    else if(parsed_json.bixby_client_version <= '2.2.46.85') {
      console.log('Parse data : Low version');
      res.send(500,'Parse data : Low version');
    }
    else if(parsed_json.feedback == undefined) {
      res.send(200,'Parse data : OK...try send log');
      parsed_json.is_negative_feedback = false;
      parsed_json.fileexist = false;
      if(parsed_json.hint_data_list != undefined){
        parsed_json.hint_data_count = parsed_json.hint_data_list.length;
      } else {
        parsed_json.hint_data_count = 0;
      }
      saveSuggestionLog(parsed_json);
      //sendToLogServer(parsed_json, 'suggestion');
    }
    else {
      res.send(200,'Parse data : OK...try send log');
      if(parsed_json.is_negative_feedback == undefined) {
        parsed_json.is_negative_feedback = true;
      }
      if(fs.existsSync('./uploads/output/'+parsed_json.session_id+'.json')) {
        parsed_json.fileexist = true;
      } else {
        parsed_json.fileexist = false;
      }
      saveFeedbackLog(parsed_json);
      //updateFeedbackToDB(parsed_json.session_id);
      //sendToLogServer(parsed_json, 'feedback');
    }
  }
});

router.post('/mongo', function(req, res, next) {
  var data = req.body.logging_data_table;
  if(data == undefined || data == null){
    console.log("Request error : There is no logging_data_table field in body");
  }
  var parsed_json = null;
  try {
    parsed_json = JSON.parse(data);
  } catch (err){
    console.log(err);
  }

  if(parsed_json == null){
    console.log('Parse data : Json parse error');
    res.send(500,'Parse data : Json parse error');
  } else{
    if(parsed_json.bixby_client_version == undefined
      || parsed_json.bixby_client_version == null) {
      //json output
      console.log('Save data : Save analyzed keyword output');
      parsed_json.output = JSON.parse(parsed_json.output);
      saveJsonToFile(parsed_json);
      updateFileExistToDB(parsed_json.filename);
      updateFeedback(parsed_json.filename,'suggestion','fileexist');
      updateFeedback(parsed_json.filename,'feedback','fileexist');
      res.send(200,'Save json complete');
      if(parsed_json.output.length == 0) {
        console.log('Save data : parsed_json is empty');
      } else {
        sendToLogServer(parsed_json, 'keyword');
      }
    }
    else if(parsed_json.bixby_client_version <= '2.2.46.85') {
      console.log('Parse data : Low version');
      res.send(500,'Parse data : Low version');
    }
    else if(parsed_json.feedback == undefined) {
      res.send(200,'Parse data : OK...try send log');
      saveSuggestionLog(parsed_json);
    }
    else {
      res.send(200,'Parse data : OK...try send log');
      saveFeedbackLog(parsed_json);
    }
  }
});

function saveSuggestionLog(parsed_json) {
  //save to mongodb
  if(parsed_json.data_from_service.data[1].ReasoningEnginePersonalizedInterests.JRDFoxExceptionList == undefined) {
    parsed_json.data_from_service.data[1].ReasoningEnginePersonalizedInterests.JRDFoxExceptionList = [];
  }

  var suggestion = new Suggestion({
    timestamp: Date.now(),
    bixby_client_version: parsed_json.bixby_client_version,
    bixby_service_version: parsed_json.bixby_service_version,
    country_code: parsed_json.country_code,
    startTimeInMillis: parsed_json.data_from_service.startTimeInMillis,
    startTime: parsed_json.data_from_service.startTime,
    endTimeInMillis: parsed_json.data_from_service.endTimeInMillis,
    endTime: parsed_json.data_from_service.endTime,
    result: parsed_json.data_from_service.result,
    device_id: parsed_json.device_id,
    fileexist: parsed_json.fileexist,
    hint_data_count: parsed_json.hint_data_count,
    hint_data_list: parsed_json.hint_data_list,
    log_version: parsed_json.log_version,
    is_negative_feedback: parsed_json.is_negative_feedback,
    session_id: parsed_json.session_id,
    interestList: parsed_json.data_from_service.data[0].interestList,
    sessionId: parsed_json.data_from_service.data[0].sessionId,
    RawdataConverterPassedDataList:parsed_json.data_from_service.data[1].ReasoningEnginePersonalizedInterests.RawdataConverterPassedDataList,
    RunestoneProfileConverterPassedDataList:parsed_json.data_from_service.data[1].ReasoningEnginePersonalizedInterests.RunestoneProfileConverterPassedDataList,
    getPersonalizedInterestsList:parsed_json.data_from_service.data[1].ReasoningEnginePersonalizedInterests.getPersonalizedInterestsList,
    resultList:parsed_json.data_from_service.data[1].ReasoningEnginePersonalizedInterests.resultList,
    JRDFoxExceptionList:parsed_json.data_from_service.data[1].ReasoningEnginePersonalizedInterests.JRDFoxExceptionList
  });

  suggestion.save(function(err, object){
      if(err) {
        return console.log(err);
      }
      console.log('sessionId : ' + object.session_id + ' success');
  });
}

function saveFeedbackLog(parsed_json) {
  //save to mongodb

  var feedback = new Feedback({
    timestamp: Date.now(),
    bixby_client_version: parsed_json.bixby_client_version,
    bixby_service_version: parsed_json.bixby_service_version,
    country_code: parsed_json.country_code,
    device_id: parsed_json.device_id,
    command_list: parsed_json.feedback.command_list,
    interest: parsed_json.feedback.interest,
    interest_feedback: parsed_json.feedback.interest_feedback,
    fileexist: parsed_json.fileexist,
    filename: parsed_json.filename,
    session_id: parsed_json.session_id,
    is_negative_feedback: parsed_json.is_negative_feedback
  });
  Feedback.find({session_id:parsed_json.session_id, interest: parsed_json.feedback.interest}, function(err, result) {
    if(err) {
      return console.log(err);
    }
    console.log(result.length);
    if(result.length > 0) {
      Feedback.update({session_id:parsed_json.session_id, interest: parsed_json.feedback.interest},
        {is_negative_feedback:parsed_json.is_negative_feedback},function(err, object){
          if(err) {
            return console.log(err);
          }
          console.log('sessionId : ' + object.session_id + ' success');
      });
    } else {
      feedback.save(function(err, object){
          if(err) {
            return console.log(err);
          }
          console.log('sessionId : ' + object.session_id + ' success');
      });
    }
  });
}

function saveJsonToFile(jsonObject){
  try {
    fs.writeFileSync('./uploads/output/'+jsonObject.filename+'.json',
    JSON.stringify(jsonObject));
  } catch (err) {
    console.log(err);
  }
}

function sendToLogServer(jsonObject, index){
  request({
    url: 'http://localhost:3003/'+index,
    method : 'POST',
    json : jsonObject
  },function (err,res,body) {
      if(err){
        console.log("Send log : Cannot send to logstash");
        console.log(err);
      } else{
        console.log("Send log : OK");
        if(index == 'feedback'){
          updateFeedback(jsonObject.session_id,'suggestion','negativefeedback');
        }
      }
    });
}
function updateFeedback(session_id,index,field){
  var jsonObject = JSON.parse('{"query": { "match": {"session_id.keyword": "'+session_id+'"}},"script": {"source":"ctx._source.'+field+' = true"}}');
  request({
    url: 'http://localhost:9200/'+index+'/_update_by_query',
    method : 'POST',
    json : jsonObject
  },function (err,res,body) {
      if(err){
        console.log(session_id +' : '+field+ ' : '+ index + " : Error");
        console.log(err);
      } else{
        console.log(session_id +' : '+field+ ' : '+ index + " : OK");
      }
    });
}

function updateFeedbackToDB(session) {
   Suggestion.update({session_id: session},{negativefeedback: true} , function(err,update_result) {
     if(err) {
       console.log(err);
       return;
      }
     console.log(update_result);
   });
}

function updateFileExistToDB(session) {
     Suggestion.update({session_id: session} , {fileexist: true}, function(err,update_result) {
       if(err) {
         console.log(err);
         return;
       }
       console.log(update_result);
     });

     Feedback.update({session_id: session}, {fileexist: true}, function(err,update_result) {
       if(err) {
         console.log(err);
         return;
       }
       console.log(update_result);
     });
}
module.exports = router;

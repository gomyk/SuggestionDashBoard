var mongoose = require("mongoose");
var mongoSchema = mongoose.Schema;
var userSchema  = {
  timestamp: 'Number',
  bixby_client_version: 'String',
  bixby_service_version: 'String',
  country_code: 'String',
  device_id: 'String',
  command_list: 'Mixed',
  interest: 'String',
  interest_feedback: 'String',
  fileexist: 'Boolean',
  filename: 'String',
  negativefeedback: 'Boolean',
  session_id: 'String'
};
module.exports = mongoose.model('feedback',userSchema);

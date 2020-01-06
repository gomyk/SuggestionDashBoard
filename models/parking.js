var mongoose = require("mongoose");
var mongoSchema = mongoose.Schema;
var userSchema  = {
  parking_id: 'String',
  type: 'String',
  feedback: 'String',
  feedback_comment: 'String',
  timestamp: 'Number',
  device_id: 'String',
  log_version: 'Number',
  bixby_client_version: 'String',
  bixby_service_version: 'String'
};
module.exports = mongoose.model('parking',userSchema);

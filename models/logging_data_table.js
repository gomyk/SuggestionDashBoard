var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/testDB');
var mongoSchema = mongoose.Schema;
var userSchema  = {
    logging_id : Number,
    device_id : String,
    time_of_request : Number,
    country_code : String,
    data_from_service : String,
    content_data : String,
    hint_data : String
};
module.exports = mongoose.model('logging_data_table',userSchema);

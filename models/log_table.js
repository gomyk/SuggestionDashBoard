var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/testDB');
var mongoSchema = mongoose.Schema;
var userSchema  = {
    log_id : Number,
    log : String
};
module.exports = mongoose.model('log_table',userSchema);

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/testDB');
var mongoSchema = mongoose.Schema;
var userSchema  = {
    command_id : Number,
    domain : String,
    cp_name : String,
    hint : String,
    icon_url : String
};
module.exports = mongoose.model('hint_commands_table',userSchema);

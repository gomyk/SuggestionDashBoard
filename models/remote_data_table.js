var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/testDB');
var mongoSchema = mongoose.Schema;
var userSchema  = {
    content_id : Number,
    domain : String,
    cp_name : String,
    greeting_msg : String,
    ui_type : Number,
    main_image : String,
    title : String,
    description : String,
    app_icon_image : String,
    goal : String,
    deeplink : String,
    in_app : Number,
    action_buttons : String,
    detail_info :String
};
module.exports = mongoose.model('remote_data_table',userSchema);

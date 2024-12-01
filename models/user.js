const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
email:{
    type:String,
    require:true,
},
});

userSchema.plugin(passportLocalMongoose);// add password, usrname , slating and hasing to the schema automatically
module.exports = mongoose.model("User" , userSchema);
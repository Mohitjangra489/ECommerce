const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema=new Schema({
username:String,
password:String,
mobile:String,
email:String,
isvarified:Boolean,
OTP:Number
});

const userModel=mongoose.model('users',userSchema);
module.exports=userModel;

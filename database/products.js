const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema=new Schema({
id:String,
url:String,
product:String,
price:String,
desc:String
});

const userModel=mongoose.model('products',userSchema);
module.exports=userModel;

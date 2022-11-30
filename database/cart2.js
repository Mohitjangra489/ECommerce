const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartschema2=new Schema({
    id:String,
    src:String,
    price:String,
    quantity:String
})

const cartModel2=mongoose.model('cartitem',cartschema2);
module.exports=cartModel2;

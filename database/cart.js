const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartSchema1 = new Schema({
    username:String,
    cartitem:Array
});

const cartModel1=mongoose.model('cart',cartSchema1);
module.exports=cartModel1;

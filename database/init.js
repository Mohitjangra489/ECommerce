const mongoose = require('mongoose');

module.exports=async function init()
{
 await mongoose.connect('mongodb+srv://mohit489:mohit489@cluster0.8ol98zz.mongodb.net/ecommerce');
 console.log(" MongoDB connected successfully");
}

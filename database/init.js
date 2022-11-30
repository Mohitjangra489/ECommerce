const mongoose = require('mongoose');

module.exports=async function init()
{
 await mongoose.connect('mongodb://127.0.0.1:27017/project');
 console.log(" MongoDB connected successfully");
}
const mongoose=require('mongoose')

// 导出用户的表结构
module.exports=new mongoose.Schema({
    username:String,
    password:String
})
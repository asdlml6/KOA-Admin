const mongoose=require('mongoose')

const userSchema=require('../Schema/user')
module.exports=mongoose.model('User',userSchema)
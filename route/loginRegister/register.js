const Koa=require('koa')
const Router=require('koa-router')
const router=new Router()
const bcrypt=require('bcrypt')
const User=require('../../Model/User')

// 做一个统一的返回的数据格式(妈的，醉了，果然是这块出的问题。。。看来还必须得加async、await)
var responseData
 router.use(async (ctx,next)=>{
    responseData={
        code:0,
        message:''
    }
    await next()
 })

// 注册的实现
router.post('/',async (ctx,next)=>{
   const {username,password}=ctx.request.body
   console.log(username,password)
   var user=await User.findOne({username})
   console.log('user',user)
   if(user.length==0){
    const result=await new User({username,password}).save()
    console.log('result',result)
    responseData.code=0
    responseData.message='注册成功'
    responseData.username=username
    ctx.response.body= responseData
    return   
   }else{
     responseData.code=1
     responseData.message='用户名重复'
     ctx.response.body=responseData
     return 
   }      
})

// 测试用例
//  router.post('/', (ctx,next)=>{
//    console.log(1)
//    console.log(ctx.request.body)
//    const {username,password}=ctx.request.body
//    ctx.response.body= {responseData,username,password}
//  })

module.exports=router.routes()
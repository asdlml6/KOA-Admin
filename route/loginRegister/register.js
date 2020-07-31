const Koa=require('koa')
const Router=require('koa-router')
const router=new Router()
const bcrypt=require('bcrypt')
const User=require('../../Model/User')

// 做一个统一的返回的数据格式
var responseData
router.use(function(ctx,next){
   responseData={
       code:0,
       message:''
   }
   next()
})

/*router.post('/',async (ctx,next)=>{
   const {username,password}=ctx.request.body
   let user=await new User({username})
   if(!user){
     const newUser=new User({username,password})
     user=await newUser.save()
     ctx.status=200
     responseData.message='注册成功'
     ctx.response.body={
         responseData,
         user
     }
   }else{
     ctx.status=406
     responseData.code=1
     responseData.message='用户名已经存在'
     ctx.response.body=responseData
   }
   return 
})*/

// 测试用例
 router.post('/', (ctx,next)=>{
   console.log(1)
   console.log(ctx.request.body)
   const {username,password}=ctx.request.body
   ctx.response.body= {responseData,username,password}
 })

module.exports=router.routes()
const Koa=require('koa')
const Router=require('koa-router')
const router=new Router()
const bcrypt=require('bcrypt')

// 做一个统一的返回的数据格式
var responseData
router.use(function(ctx,next){
   responseData={
       code:0,
       message:''
   }
   next()
})

router.post('/',async (ctx,next)=>{
   console.log('register')
   const {username,password}=ctx.request.body
   responseData.message='注册成功'
   ctx.response.body={
       username,
       password,
       responseData       
   }
   return
})

module.exports=router.routes()
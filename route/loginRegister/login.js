const Koa=require('koa')
const Router=require('koa-router')
const path=require('path')
const {sign,verify}=require('jsonwebtoken')
const secret='demo'    // 密钥
//const jwt=require('koa-jwt')({secret})
const router=new Router()
const {getSvgCaptcha,setToken}=require('../../util/index')
const User=require('../../Model/User')

// 做一个统一的返回处理
var responseData
var svgCaptchaResult
router.use(async (ctx,next)=>{
  responseData={
    code:0,
    message:''
  }
  await next()
})

// 登录功能（get方式）
router.get('/',async (ctx,next)=>{
  const svg=getSvgCaptcha()
  const svgData=svg.data
  const svgResult =svg.text         // 图形验证码的结果（这里我就不忽略大小写问题了,4位）
  svgCaptchaResult=svgResult
  ctx.response.type='image/svg+xml'
  ctx.response.body=svgData
})

// 登录接口测试（post方式）
router.post('/',async (ctx,next)=>{
   // 用户名、密码、验证码都正确的话，才生成token
   const {username,password,verification} = ctx.request.body
  // const {username,password} = ctx.request.body

   if(verification!=svgCaptchaResult){
     responseData.code=2
     responseData.message='验证码错误或者大小写错误'
     ctx.response.body=responseData
     return 
   }
   const user=await User.findOne({username,password})
   if(user.length==0){
     responseData.code=2
     responseData.message='用户名或者密码错误'
     ctx.response.body= responseData
     return 
   }else{
     console.log('要登录')
     const {username}=user
     responseData.code=0
     responseData.message='登录成功'
     responseData.username=username
     setToken(username).then((value)=>{
       responseData.token=value
       ctx.response.body=responseData
     })
     await next()
     return 
   }
})

module.exports=router.routes()
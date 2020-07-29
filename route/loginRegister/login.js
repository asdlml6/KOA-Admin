const Koa=require('koa')
const Router=require('koa-router')
const path=require('path')
const {sign}=require('jsonwebtoken')
const secret='demo'
const jwt=require('koa-jwt')({secret})
const router=new Router()
const {getSvgCaptcha}=require('../../util/index')


// 登录功能（注册功能不需要jwt认证）
router.get('/',async (ctx,next)=>{
  console.log(1)
  const svg=getSvgCaptcha()
  const svgData=svg.data
  const svgResult =svg.text         // 图形验证码的结果（这里我就不忽略大小写问题了）
  ctx.response.type='image/svg+xml'
  ctx.response.body=svgData
})


module.exports=router.routes()
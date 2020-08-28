const Koa=require('koa')
const Router=require('koa-router')
const router=new Router()
const jwt=require('koa-jwt')
const User = require('../../Model/User')
const Content=require('../../Model/Content')
const secret='demo'
//const Need_Token=jwt({secret})

router.post('/',async (ctx,next)=>{
  var category
  var userId
  const userResult=await User.findOne({
    username:ctx.state.username
  }) 
  if(!userResult){
      ctx.body={
         code:'0',
         message:'该用户不存在，请重新登录'
      }
      return
  }
  if(userResult){
     userId=userResult._id
  }
  console.log('userId',userId)
  var {title,description,radioArray,tags,html,view}=ctx.request.body
  if(view==null || view==undefined){
    view=0
  } 
  category=radioArray[0].value
  const result=await new Content({
    title,
    description,
    category,
    tags,
    html,
    view,
    user:userId 
  }).save()
  ctx.response.body={
    code:0,
    message:'编辑文章成功'
  }
  return 
})

router.get('/',async (ctx,next)=>{
  ctx.body={
    code:0,
    message:'有权利访问'
  }
  return 
})

module.exports=router.routes()
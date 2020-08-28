const Router=require('koa-router')
const router=new Router()
const Content=require('../../Model/Content')

router.get('/',async (ctx,next)=>{
   const response=await Content.find().populate('user')
  // const response=await Content.find()
  console.log('页面初始化获取数据',response)
   ctx.body={
       code:0,
       response
   }
   return 
})

module.exports=router.routes()

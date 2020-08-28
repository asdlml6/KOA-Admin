const jwt=require('jsonwebtoken')
async function check(ctx,next){
   console.log('进入验证')
   let url=ctx.url.split('?')[0]?ctx.url.split('?')[0]:ctx.url
   console.log('url',url)
   if(url==='/login' || url==='/register' || url=='/home'){
     await next()
   }else{
       //let token=ctx.req.headers["authorization"]
       let auth=ctx.req.headers.authorization?ctx.req.headers.authorization:null
       let token=ctx.req.headers.cookie?ctx.req.headers.cookie.split('=')[1]:auth
       //let auth=ctx.req.headers.authorization?ctx.req.headers.authorization:null
       console.log('看一看headers',ctx.req.headers)
       if(token!=undefined && token!='' && token!=null){
           console.log('token',token)
           const tokenItem=jwt.verify(token,'demo')
           console.log('解析token：',tokenItem)
           const {time,timeout,username}=tokenItem
           var date=new Date().getTime()
           console.log('111111111')
           if(date-time<=timeout){
                 ctx.state.username=username
                 console.log('222222')
                 await next()
           }else{
               ctx.body={
                   status:401,
                   message:'登录过期，请重新登录'
               }
           }
        }else{
            console.log('没有token')
             ctx.body={
                 status:401,
                 message:'请求没有凭证'
             }
       }
   }
}

module.exports=check
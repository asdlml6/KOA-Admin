const svgCaptcha=require('svg-captcha')
const jwt=require('jsonwebtoken')
const secret='demo'

// 生成验证码
 const getSvgCaptcha=function(){
   const captcha=svgCaptcha.create({
       size:4,                  // 验证码的长度
       ignoreChars:'0oLIli',    // 忽略的字符
       noise:1,                 // 干扰的线条数量
       color:true,              // 字体是否有颜色
       background:'#cc9966'     // 背景颜色
   })
   return captcha 
}

// 检查token的有效性（测试用例1,这个用例没用上）
const checkToken=function(){
  const checksToken = async function(ctx,next){
    let token=ctx.request.headers["authorization"]
    console.log(token)
    if(token){   // 如果存在token就解析
      const tokenItem=jwt.verify(token,secret,function(err,decode){
         if(err){
          ctx.response.body=err
          return 
         }
      })    // 解析token
      console.log('token',tokenItem)
      const {time,timeout}=tokenItem              // 将token的创建时间和过期时间解构出来
      let data=new Date().getTime()
      if(data-time<=timeout){                     // 如果当前的时间-创建时间<=过期时间，说明token没有过期
        await next()
      }else{
        ctx.response.body={
          code:2,
          message:'账号已经过期，请重新登录'
        }
      }
    }
  }
  return checksToken
}

// 生成token（测试用例2）
const setToken=function(username){
   return new Promise((resolve,reject)=>{
     const token=jwt.sign({
       username,
       timeout:Date.now()
     },secret,{
       expiresIn:'0.05h'
     })
     resolve(token)
   }).catch((err)=>{
     console.log('setToken err:',err)
   })
}

// 解析token（并验证token是否有效）
const verToken=function(token){
  return new Promise((resolve,reject)=>{
    var userInfo=jwt.verify(token.split(' ')[1],secret,{
      complete:true
    })
    resolve(userInfo)
  }).catch((err)=>{
     console.log('verToken err:',err)
  })
}

module.exports={getSvgCaptcha,checkToken,setToken,verToken}
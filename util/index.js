const svgCaptcha=require('svg-captcha')

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
module.exports={getSvgCaptcha}
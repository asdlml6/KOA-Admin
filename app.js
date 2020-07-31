const Koa=require('koa')
const KoaStatic=require('koa-static')
const Router=require('koa-router')
const bodyParser=require('koa-bodyparser')
const views=require('koa-views')
const cors=require('koa2-cors')
const svgCaptcha=require('svg-captcha')
const path=require('path')
const {sign}=require('jsonwebtoken')
const secret='demo'
const jwt=require('koa-jwt')({secret})
const mongoose=require('mongoose')

const app=new Koa()
const router=new Router()

// 解决跨域问题
app.use(cors())

app.use(bodyParser())
// 加载模板引擎   （访问：localhost:3005/index.ejs）
app.use(views(path.join(__dirname,'./view'),{
     map:{html:'ejs'}
}))

// 访问图片，直接通过 localhost:3005/hy.jpg 就可以访问到
app.use(KoaStatic(path.join(__dirname,'./static')))

// 利用jwt进行鉴权处理（登录和注册不用被鉴权）
app.use(jwt.unless({
  path:[/\/register/,/\/login/]
}))

// 按照功能的不同，将路由进行模块化处理
router.use('/login',require('./route/loginRegister/login.js'))
router.use('/register',require('./route/loginRegister/register.js'))



// 处理一下图形验证码的路由
router.get('/code',async (ctx,next)=>{
  const cap=svgCaptcha.create({
      size:4,         // 验证码的长度
      width:160,
      height:50,
      fontSize:50,
      ignoreChars:'0oOliLI',   // 验证码的字符排除0oOliLI
      noise:2,                 // 干扰线条数量
      color:true,
      background:'#eee'
  })
  let text=cap.text.toLowerCase()  // 忽略大小写
  //ctx.set('Content-Type','image/svg+xml')
  ctx.response.type='html'
  ctx.response.body=`<a href="javascript: window.location.reload();">${cap.data}</a>`
  console.log(cap.text)       // 图形验证码的结果
//   console.log(ctx.request.body)
//   console.log(ctx.request.method)
})



app.use(router.routes())
app.use(router.allowedMethods())

// 连接数据库
//  mongoose.connect('mongodb://localhost:27016/koaBlog',{useNewUrlParser: true },function(err,data){
//     if(err){
//       console.log('数据库报错:',err)
//     }else{
//       console.log('数据库连接成功')
//     }
//  })

app.listen('3005',function(){
    console.log(' 3005 is running')
})

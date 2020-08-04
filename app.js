const Koa=require('koa')
const KoaStatic=require('koa-static')
const Router=require('koa-router')
const bodyParser=require('koa-bodyparser')
const views=require('koa-views')
const cors=require('koa2-cors')
const svgCaptcha=require('svg-captcha')
const path=require('path')
const {sign,verify}=require('jsonwebtoken')
const secret='demo'
// 进行路由鉴权的(只需要在路由上加上Need_Token，即可实现权限路由)
const jwt=require('koa-jwt')
//const Need_Token=jwt({secret})
const {checkToken,setToken,verToken}=require('./util/index')
const mongoose=require('mongoose')

const app=new Koa()
const router=new Router()

// 解决跨域问题
app.use(cors())

// 解析post路由携带的数据
app.use(bodyParser())

// 加载模板引擎   （访问：localhost:3005/index.ejs）
app.use(views(path.join(__dirname,'./view'),{
     map:{html:'ejs'}
}))

// 访问图片，直接通过 localhost:3005/hy.jpg 就可以访问到
app.use(KoaStatic(path.join(__dirname,'./static')))

app.use(async (ctx,next)=>{
  var token=ctx.request.headers.authorization
  if(token==undefined){
    await next()
  }else{
    verToken(token).then((data)=>{
      ctx.state={data} 
    })
    await next()
  }
})

// 验证token是否过期
app.use(async (ctx,next)=>{
   console.log('222')
   return next().catch((err)=>{
      if(err){
          ctx.status=401          
          ctx.response.body={
             status:401,
             message:'登录过期，请重新登录'
          }
      }
    })
})


// 利用jwt进行鉴权处理（登录和注册不用被鉴权）
app.use(jwt({secret}).unless({
  path:[/\/register/,/\/login/]
}))


// 为所有的请求设置请求头Authorization(有些路由需要相关权限才能访问，这个权限就是token)
/*app.use(async (ctx,next)=>{
  let params=Object.assign({},ctx.request.query,ctx.request.body)
  ctx.request.header={'authorization':"Bearer "+(params.token || '')}
  await next()
})*/

// 检验token的有效性
/*app.use(async (ctx,next)=>{
  checkToken()(ctx,next)
})*/

// 按照功能的不同，将路由进行模块化处理
// 登录和注册不用进行token的验证
router.use('/login',require('./route/loginRegister/login.js'))
router.use('/register',require('./route/loginRegister/register.js'))
router.use('/api',require('./route/api/index'))

app.use(router.routes())
app.use(router.allowedMethods())

// 连接数据库
mongoose.connect('mongodb://localhost:27016/koaBlog',{useNewUrlParser: true },function(err,data){
    if(err){
      console.log('数据库报错:',err)
    }else{
      console.log('数据库连接成功')
    }
})

app.listen('3005',function(){
    console.log(' 3005 is running')
})

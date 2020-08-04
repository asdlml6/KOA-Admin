#####                KOA后台搭建（基本上自己搭建了一个KOA脚手架）
###    一、创建模块目录
             1.1、db                  指定mongodb数据存放目录
             1.2、Model               mongodb模型
             1.3、route               路由相关配置
             1.4、Schema              表结构
             1.5、view                视图层
             1.6、static              图片目录
             1.8、util                工具模块（比如生成验证码等等）
             1.7、app.js              入口文件

###    二、安装相应模块
             2.1、koa                 这个就不用多说了吧。。。
             2.2、koa2-cors           解决后端跨域
             2.3、koa-router          解决路由问题
             2.4、koa-bodyparser      处理POST请求携带的参数
             2.5、koa-views           处理动态资源（一般是数据和模板的结合来渲染页面,比如index.ejs）
             2.6、koa-static          静态资源文件目录（放一些图片用的,确切的说单独存放图片的）
             2.7、nodemon             热更新
             2.8、koa—session         在服务端存储临时数据，相当于客户端的cookie   
             2.9、svg-captcha         图形验证码的库
             2.10、koa-jwt            jwt实现路由鉴权
             2.11、jsonwebtoken       跟koa-jwt一起使用
             2.12、mongoose           连接数据库利器
             2.13、bcrypt             用户密码加密

###    三、静态资源和动态资源服务器的实现
            3.1、静态资源image就不用多说了吧，一个项目的所有图片肯定要专门放在一个目录下，要不然后期的
            文件大小会非常大。
                 关键代码：
                   ```
                      app.use(KoaStatic(path.join(__dirname,'./static')))
        
                   ```
                 访问图片路径:
                   http://localhost:3005/xxx.jpg

            3.2、动态资源的使用（主要是一些html、css）
                  关键代码：
                    ```
                      app.use(views(path.join(__dirname,'./view'),{
                         map:{html:'ejs'}
                      })) 
                    ```
                    这样所有的html文件都可以使用ejs语法了，而且所有的 html 都会去view目录下寻找

###    四、KOA实现验证码登录
            关键代码：
             ```
                 ctx.response.type='html'
                 ctx.response.body=`<a href="javascript: window.location.reload();">${cap.data}</a>`
             ```
             具体代码：
                 
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
                })
            功能: 访问localhost:3005/code 会随机生成一个验证码，并且每点击一次都会生成新的验证码
            缺点：1、如果这样做的话就没前端什么事了，浏览器直接渲染了。。。
                 2、 重新生成验证码的代价太大，因为上述做法实际上是重新渲染了页面。。。
            功能补全：
                 下一步要想想如何能跟前端联调一下

###    五、跨域问题的解决
            跨域问题可以由前端来解决，也可以后端来解决。后端解决跨域问题可以借助第三方来实现（这么做也比较简单）,
            也可以自己设置。
            解决方案：
             5.1、借助第三方
                    npm install koa2-cors --save
                    const cors=require('koa2-cors')
                    app.use(cors())
                    [参考]: GitHub上搜索koa2-cors              
             5.2、自己搭建
                    ```
                      这个不想说了。。
                    ```

###    六、KOA+Nuxtjs实现验证码功能(恭喜，终于成功了)
            今天终于把验证码这一块的核心整完了，剩下的就是注册了。注册很好整，其实注册和登录如果用cookie+session来实现的话真的非常简单（不是吹牛逼，这么实现的话，半个小时就可以把这两个功能写完），但是如果这样的话，那跟不思进取也没什么区别了，岂不是浪费了时间。。。
             6.1、 进入正题:
                    先说说我最开始的实现过程: 起初后端这块，我返回的是一个json对象，这个对象里包含验证码的结果、验证码自身，这样如果验证码的自身能够被渲染的话，那我就可以在前端对登录进行验证，解放了一部分后端。但是我发现在asyncData生命周期中发送Ajax确实能够在渲染组件之前获取验证码的结果，但是不能够显示验证码自身。
             6.2、 出错原因：
                    只要是img类型的组件或者标签需要的都是图片的地址，而我的返回对象里没有图片的地址，只有<svg .../>，所以出错了
             6.3、改正错误：
                    1、改进后端返回的结果 ，只返回验证码自身
                    2、既然前端对验证码的输入验证不了，那就只有在后端进行验证，所以去掉asyncData生命周期
                    3、在data方法里返回一个对象，对象里包含请求后端图片的地址，即http://localhost:3005/register
                    4、:src='url'即可
                    5、测试发现成功了，验证码出来了
             6.4、改进（实现点击刷新验证码）
                    这个主要前端的工作了，只需要给img标签添加一个点击事件就可以了，这个点击事件主要是给请求地址添加一一个随机数，这样就可以根据随机数的不同来实现点击刷新了。             

###     七、打通数据库
              我们这里用到的是mongodb数据库，所以需要mongoose这个连接利器，说来也奇怪，当时后端项目搭建的时候我就在想
              mongodb咋连接来着。。。
              结果今天安装完mongoose模块后，我直接在mongod所在模块目录下先输入cmd，然后再输入以下命令：
                mongod --dbpath xxxxx  --port=27016
              然后数据库就连接上了（可能是肌肉记忆吧）。。。

###      八、注册模块的实现
              先说一下我遇到的坑吧（这个坑踩了2个多小时，也是服了。。。）。我这里想要做一个统一的返回的格式，如下：
                ```
                  var responseData

                  // 数据统一返回（这么写虽然有很多人会不屑，但是对于一个学生项目来说即简单又粗暴）
                  router.use((ctx,next)=>{
                     responseData={
                       code:0,
                       message:''
                     }
                     next()
                  })

                  // 当时的测试用例 (篇幅有限，逻辑就不全写了，想看全部逻辑请到route文件夹下寻找)
                  router.post('/',(ctx,next)=>{
                     const {username,password} = ctx.request.body
                     responseData.code=0
                     responseData.message='注册成功'
                     ctx.response.body=responseData  
                     return 
                  })

                  // 当时的测试结果（当时我觉得成功了）：
                     {
                            code:0,
                            message:'注册成功'
                     }

                  // 今天把有关数据库的注释都放开（具体代码请看app.js和route文件夹），postman测试结果为404。。。
                ```
              有了404咱就得排查啊，结果这排查可让我走了不少弯路，排查过程不说了，最后问题出在统一返回的中间件上。中间件的写法有3中格式：（这块会整理出一个专栏）
                 1、common function
                      原因分析：
                              我们当时测试用例的写法就是common写法，这种情况下，我们的next()返回的其实是promise，也就是说你得使用promise.then()的形式进入下一个中间件，而我们下一个异步中间件是通过async来进入的，所以说2种写法不一样，导致了进程一直处于pending，造成了404
                      问题解决：
                              在所有的中间价前面加上async，并且在异步操作前面加上await
                 
                 2、async  function（KOA2推荐使用）

                 3、generator function              

###   九、实现Token登录（前端登录方式我会整理成一个专栏）
           9.1、什么是Token登录？
                 Token是服务端生成的一串字符串，用来作为客户端请求的一个令牌。每次登录，服务端都会生成一个token
                 字符串返回给前端。客户端访问权限路由的时候，都要带上这个token进行身份验证。
           
           9.2、Token字符串的组成（具体详细信息请到GitHub上搜索jsonwebtoken）
                 header.payload.signature
              9.2.1、header(头信息)
              9.2.2、payload(负载)
              9.2.3、signature(签名)

           9.3、Token实现流程
              9.3.1、输入用户名和密码
              9.3.2、服务端验证用户名和密码是否正确，正确则创建token
              9.3.3、返回给客户端token，客户端存储token
              9.3.4、访问其他权限路由时，客户端请求时带上token，服务端进行验证

          9.4、Token的特点
              9.4.1、解放了一部分后端，因为后端不用存储token，只需验证即可
              9.4.2、前端保存token不一定非要保存在cookie中，提高了页面的安全性
              9.4.3、token下发后，有效时间内有效

          9.5、生成Token的方式？
                jsonwebtoken(JWT)

          9.6、验证token是否有效？
                这个主要就是验证token是否过期。这个主要有2种方式。要么自己编写一个中间件，要么借用库中的方法
                我是把库中的方法封装在一个中间件里了。具体的信息请到util目录下去找vertoken。
                注意事项：
                        1、这里我用的promise，因为库用的是回调函数，回调函数不太友好（回调地狱。。。）
                        2、还是那句话，具体的信息还得参照GitHub上的jsonwebtoken库
                        3、注意流程：解析token-> 验证->鉴权
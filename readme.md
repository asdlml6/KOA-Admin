#####                KOA后台搭建（基本上自己搭建了一个KOA脚手架）
###    一、创建模块目录
             1.1、db                  指定mongodb服务器位置的模块
             1.2、Model               mongodb模型
             1.3、route               路由相关配置
             1.4、Schema              表结构
             1.5、view                视图层
             1.6、static              图片目录
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
            功能: 访问localhost:3005/code 会随机生成一个验证码，并且每点击一次都会生成新的验证码
            缺点：1、如果这样做的话就没前端什么事了，浏览器直接渲染了。。。
                 2、 重新生成验证码的代价太大，因为上述做法实际上是重新渲染了页面。。。
            功能补全：
                 下一步要想想如何能跟前端联调一下
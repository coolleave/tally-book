var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const dbOptions = require('./config/config')



const indexRouter = require('./routes/web/index')
const accountRouter = require('./routes/api/account')
const regRouter = require('./routes/web/reg')
const regApiRouter = require('./routes/api/reg')


var app = express()
const sessionStore = new MySQLStore(dbOptions);

app.use(session({
  key: 'sid',  // 设置cookie的key， 默认为connect.sid
  secret: 'jojoj',  // 加盐又称签名
  store: sessionStore,
  resave: false,
  saveUninitialized: false,  // 是否每一次都设置一个cookie来储存session
  cookie:{
    httpOnly:true,  // 开启后前端无法通过js操作
    maxAge:1000 * 60 * 60*24*7  // 设置sessionid过期时间，以毫秒为单位
  }
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


// 设置web路由
app.use('/', indexRouter)
app.use('/',regRouter)

// 设置api接口路由
app.use('/api', accountRouter)
app.use('/api',regApiRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('404.ejs')
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})



module.exports = app

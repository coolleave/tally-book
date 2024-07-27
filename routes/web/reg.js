const express = require('express');
const router = express.Router();
const mysql = require('mysql2')
const md5 = require('md5')

// 导入连接数据库中间件
const ConnectSQL = require('../../middleware/ConnectSQL')


// 注册界面
router.get('/reg', (req, res) => {
  res.render('reg.ejs')
})


//注册数据发送
router.post('/reg', ConnectSQL,(req, res) => {
  // 插入到数据库
  res.sqlConnection.query('INSERT INTO users SET ?', { ...req.body, password: md5(req.body.password) }, function (err, results, fields) {
    if (err) throw err;
    console.log('Inserted ' + results.affectedRows + ' row(s).')
  })
  res.render('success.ejs', { msg: "注册成功", url: "/login" })
})


// 渲染登录界面
router.get('/login', (req, res) => {
  res.render('login.ejs')
})


// 发送登录数据
router.post('/login', ConnectSQL,(req, res) => {
  var { username, password } = req.body
  var password_md5 = md5(password)
  // 查询数据库中的用户信息
  res.sqlConnection.query('SELECT * FROM users WHERE username = ?', username, (error, results, fields) => {
    // 检查是否找到匹配的用户
    if (results.length === 0) {
      // 用户不存在
      res.render('success.ejs',{msg:'用户不存在，请注册！',url:'/reg'})
      return;
    }
    const password = results[0].password
    if(password_md5 === password){
      // 添加session
      console.log(username);
      req.session.username = username
      res.render('success.ejs', {msg:'密码登录成功', url:'/account'})
    }else{
      console.log(password_md5,password);
      res.render('success.ejs', {msg:'密码错误！请重试', url:'/login'})
    }
  })
})



module.exports = router
const express = require('express')
const router = express.Router()
const mysql = require('mysql2')
const md5 = require('md5')
//导入token 加盐配置
const {secret} = require('../../config/config')

const jwt = require('jsonwebtoken')

// 导入连接数据库中间件
const ConnectSQL = require('../../middleware/ConnectSQL')



// 发送登录数据
router.post('/login', ConnectSQL,(req, res) => {
  var { username, password } = req.body
  var password_md5 = md5(password)
  // 查询数据库中的用户信息
  res.sqlConnection.query('SELECT * FROM users WHERE username = ?', username, (error, results, fields) => {
    // 检查是否找到匹配的用户
    if (results.length === 0) {
      // 用户不存在
      res.json({
        code:'2001',
        msg: '用户不存在',
        data:null
      })
      return
    }
    const password = results[0].password
    if(password_md5 === password){
      // 添加session
      console.log(username)
        let token = jwt.sign({
            username : username
        },secret,{
            expiresIn : "1h"
        })  
      res.json({
        code:'2000',
        msg: '登录成功',
        data:token
      })
    }else{
      // console.log(password_md5,password)
      // 密码错误
      res.json({
        code:'2002',
        msg: '密码错误',
        data:null
      })
    }
  })
})



module.exports = router
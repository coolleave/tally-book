const express = require('express')
const router = express.Router()
const shortid = require('shortid')
const mysql = require('mysql2')

// 导入登录检测中间件
const CheckLoginMW = require('../../middleware/CheckLoginMW.js')

// 导入连接数据库中间件
const ConnectSQL = require('../../middleware/ConnectSQL')
// const session = require('express-session')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/account')
})


// 记账本内容
router.get('/account', CheckLoginMW,ConnectSQL, function (req, res, next) {
  // 查询 logs 表的数据并以 JSON 格式返回
  res.sqlConnection.query('SELECT * FROM logs', (err, logs, fields) => {
    if (err) {
      console.error('Error querying database: ' + err.stack)
      return
    }
    res.render('index.ejs', { logs: logs })
  })
})


// 新增记录
router.get('/account_create',CheckLoginMW, ConnectSQL,function (req, res, next) {
  res.render('create.ejs')
})


// 添加记录
router.post('/account',CheckLoginMW, ConnectSQL,function (req, res, next) {
  req.body.shortId = shortid.generate()
  console.log(req.body)
  // 插入数据
  res.sqlConnection.query('INSERT INTO logs SET ?', req.body, function (err, results, fields) {
    if (err) throw err
    console.log('Inserted ' + results.affectedRows + ' row(s).')
  })
  res.render('success.ejs', { msg: '添加成功哦', url: '/account' })
})

// 删除数据
router.get('/account/delete/:id',CheckLoginMW, ConnectSQL,function (req, res) {

  let shortidToDelete = req.params.id

  res.render('success.ejs', { msg: '删除成功！', url: '/account' })

  // SQL 查询语句，删除 logs 表中 shortid 等于指定值的记录
  const sql = `DELETE FROM logs WHERE shortid = ?`
  // 执行 SQL 查询
  res.sqlConnection.query(sql, [shortidToDelete], (err, results) => {
    if (err) {
      console.error('Error deleting record:', err)
      return
    }
    console.log('Deleted', results.affectedRows, 'rows')
  })
})


// 退出登录
router.get('/logout', CheckLoginMW, function(req,res){
  req.session.destroy()
  res.render('success.ejs', { msg: '退出成功！', url: '/login' })
})
module.exports = router

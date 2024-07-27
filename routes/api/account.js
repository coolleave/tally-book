const express = require('express')
const router = express.Router()
const shortid = require('shortid')
const mysql = require('mysql2')
// 连接数据库中间件
const ConnectSQL = require('../../middleware/ConnectSQL')
// 校验token中间件
const CheckLoginMW = require('../../middleware/checkTokentMW.js')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/account')  // 重定向到account页面
})


// 记账本内容
router.get('/account', CheckLoginMW, ConnectSQL, function (req, res, next) {
  // 查询 logs 表的数据并以 JSON 格式返回
  res.sqlConnection.query('SELECT * FROM logs', (err, logs, fields) => {
    // 响应失败
    if (err) {
      res.json({
        code: '1001',
        msg: '读取失败',
        data: null
      })
      return
    }
    res.json({
      // 响应编号
      code: '0000',
      // 读取信息
      msg: '读取成功！',
      // 获取数据
      data: logs
    })
  })
})


// 添加记录
router.post('/account', CheckLoginMW, ConnectSQL, function (req, res, next) {
  // 生成shorid
  req.body.shortId = shortid.generate()
  // 插入数据
  res.sqlConnection.query('INSERT INTO logs SET ?', req.body, function (err, results, fields) {
    if (err) throw err
    console.log('Inserted ' + results.affectedRows + ' row(s).')
  })
  res.json({
    code: '0000',
    msg: '添加成功！',
    data: results
  })
})

// 删除账单
router.get('/account/delete/:id', CheckLoginMW, ConnectSQL, function (req, res) {

  let shortidToDelete = req.params.id
  console.log(shortidToDelete)
  res.render('success.ejs', { msg: '删除成功！', url: '/account' })
  // SQL 查询语句，删除 logs 表中 shortid 等于指定值的记录
  const sql = `DELETE FROM logs WHERE shortid = ?`
  // 执行 SQL 查询
  res.sqlConnection.query(sql, [shortidToDelete], (err, results) => {
    if (err) {
      console.error('Error deleting record:', err)
      res.json({
        code: '1002',
        msg: '删除失败！',
        data: null
      })
      return
    }
    console.log('Deleted', results.affectedRows, 'rows')
    res.json({
      code: '0000',
      msg: '删除成功！',
      data: results
    })
  })
})


// 查询单个账单
router.get('/account/query/:id', CheckLoginMW, ConnectSQL, function (req, res) {
  let { id } = req.params
  const sql = `SELECT * FROM logs WHERE shortid = ?`
  res.sqlConnection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting record:', err)
      res.json({
        code: '1003',
        msg: '查询失败！',
        data: null
      })
      return
    } else {
      res.json({
        code: '0000',
        msg: '查询成功！',
        data: results
      })
    }
    return
  })
})

// 更新的单个账单
router.patch('/account/update/:id', CheckLoginMW, ConnectSQL, function (req, res) {
  let { id } = req.params
  const sql = 'UPDATE logs SET ?  WHERE shortid = ?'

  res.sqlConnection.query(sql, [req.body, id], (err, results) => {
    if (err) {
      console.error('Error deleting record:', err)
      res.json({
        code: '1004',
        msg: '查询失败！',
        data: null
      })
      return
    } else {
      const sql_select = `SELECT * FROM logs WHERE shortid = ?`
      res.sqlConnection.query(sql_select, [id], (err, results) => {
        if (err) {
          console.error('Error deleting record:', err)
          res.json({
            code: '1005',
            msg: '查询失败！',
            data: null
          })
          return
        } else {
          res.json({
            code: '0000',
            msg: '查询成功！',
            data: results
          })
        }
        return
      })
    }
  })
})
module.exports = router

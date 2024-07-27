const mysql = require('mysql2')
const dbOptions = require('../config/config')
// 连接数据库
// 创建数据库连接
module.exports= (req,res,next)=>{ const connection  = mysql.createConnection(dbOptions)
  
  // 连接到数据库
  connection.connect(function (err) {
    if (err) {
      return console.error('error connecting: ' + err.stack)
    }
    console.log('connected as id ' + connection.threadId)
    res.sqlConnection = connection
    next()
})
}

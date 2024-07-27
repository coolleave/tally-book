const jwt = require('jsonwebtoken')
const {secret} = require('../config/config')
module.exports = (req, res, next) => {
    let token = req.get('token')
    // 判断有无token
    if (!token) {
        return res.json({
            code: '3001',
            msg: '没有token信息',
            data: null
        })
    }
    // 校验token
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            return res.json({
                code: '3002',
                msg: '校验失败',
                data: null
            })
        }
        
        req.user = data
        next()

    })


}
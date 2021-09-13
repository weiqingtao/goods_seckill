const router = require('koa-router')()
const seckillMysql = require('../controller/seckill_mysql')
const seckillRedis = require('../controller/seckill_redis')

router.get('/buy_mysql', seckillMysql.buy)
router.get('/buy_redis', seckillRedis.buy)
module.exports = router

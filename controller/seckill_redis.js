const redis = require("../DB/redis");
const uuid = require("uuid")
/**
 * redis分布式锁 利用setnx
 * 
 */
module.exports = {
  async buy(ctx) {
    const lockKey = "product_1";
    const lockValue = uuid.v4();
    try {
      const data = await redis.set(lockKey, lockValue, "EX", 3, "NX");
      if (!data) {
        return ctx.body = {
          message: "手气不好下次再来"
        }
      }
      const count = await redis.get("goods_count");
      if (parseInt(count) > 0) {
        const time = new Date();
        const at = Math.round(time / 1000);
        await redis.zadd("user_goods_list", at, uuid.v4())
        await redis.decr("goods_count");
        if (lockValue == await redis.get(lockKey)) { // 防止高并发的时候 误删别的进程的key
          await redis.del(lockKey);
        }
        ctx.body = {
          message: "抢到了"
        }
      } else {
        ctx.body = {
          message: "goods is empty"
        }
      }
    } finally {
      // 无论何时都执行，防止死锁
      if (lockValue == await redis.get(lockKey)) {
        await redis.del(lockKey);
      }
    }
  }
}


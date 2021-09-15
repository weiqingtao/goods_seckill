const redis = require("../DB/redis");
const uuid = require("uuid")
module.exports = {
  async buy(ctx) {
    try {
      const lockKey = "product_1"
      const data = await redis.set(lockKey, lockKey, "EX", 20, "NX");
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
        ctx.body = {
          message: "抢到了"
        }
      } else {
        ctx.body = {
          message: "goods is empty"
        }
      }
    } catch (error) {
      console.log(error)
      ctx.body = {
        message: "fail"
      }
    }
    // try {
    //   const lockKey = "product_1"
    //   await redis.setex(lockKey,10,lockKey);
    //   await redis.get
    //   if (parseInt(count) > 0) {
    //     console.log(count);
    //     const time = new Date();
    //     const at = Math.round(time / 1000);
    //     await redis.setex
    //     const data = await redis.multi().zadd("user_goods_list", at, uuid.v4()).set("goods_count", count - 1).exec();
    //     ctx.body = {
    //       message: "抢到了"
    //     }
    //   } else {
    //     ctx.body = {
    //       message: "goods is empty"
    //     }
    //   }
    // } catch (error) {
    //   console.log(error)
    //   ctx.body = {
    //     message: "fail"
    //   }
    // }
  }
}


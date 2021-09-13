const redis = require("../DB/redis")
module.exports = {
  async buy(ctx) {
    try {
      const count = await redis.get("goods_count");
      if (count > 0) {
        await redis.watch("goods_count");
        const userId = Math.floor(Math.random() * (1000 - 1) + 1);
        await redis.multi().hset("user_goods_list", "user_id_" + userId, userId).set("goods_count", count - 1).exec();
        ctx.body = {
          message: "success"
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
  },
}

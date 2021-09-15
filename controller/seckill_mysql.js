const mysql = require("../DB/mysql")
module.exports = {
  async buy(ctx) {
    const goods = await mysql.query("select * from goods where id = 1");
    if (goods[0].good_count > 0) {
      // const conn = await mysql.getConnection();
      // await conn.beginTransaction();
      try {
        await mysql.query('insert into good_orders(good_id,user_id,create_at) values(?,?,?)', [1, new Date() / 1000, new Date() / 1000]);
        await mysql.query('update goods set good_count = good_count - 1 where id = 1 and good_count>0');
        // await conn.execute('insert into good_orders(good_id,user_id,create_at) values(?,?,?)', [1, new Date() / 1000, new Date() / 1000])
        // await conn.execute('update goods set good_count = good_count - 1 where id = 1 and good_count>0');
        // await conn.commit();
        // conn.release();
        console.log("真好 买到了")
        ctx.body = {
          message: "success"
        }
      } catch (error) {
        await conn.rollback();
        conn.release();
        ctx.body = {
          message: "fail"
        }
      }
    } else {
      ctx.body = {
        message: "goods is empty"
      }
    }
  }
}

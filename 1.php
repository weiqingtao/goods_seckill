<?php
header("content-type:text/html;charset=utf-8");
$redis = new redis();
$result = $redis->connect('127.0.0.1', 6379);
$gots = $redis->get("gots");  // 已抢数量
$robTotal = 100;  // 抢购总数量
if ($gots < $robTotal) {
    $redis->watch("gots");  // 监听key
    $redis->multi();  // 开启事务
    //插入抢购数据  
    $redis->hSet("userList", "user_id_" . mt_rand(1, 9999), time());
    $redis->set("gots", $gots + 1);  // 抢购到+1
    $robResult = $redis->exec();  // 执行事务
    if ($robResult) {
        echo "抢购成功！<br/>";
        echo "剩余数量：" . ($robTotal - ($redis->get("gots"))) . "<br/>";
        echo "用户列表：<pre>";
        var_dump($redis->hGetAll("userList"));
    } else {
        echo "手气不好，再抢购！";
        exit;
    }
}else {
    echo "已售罄";
    exit;
}
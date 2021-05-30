// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 结束游戏云函数入口函数
exports.main = async (event, context) => {
  // 获取请求的上下文信息
  const wxContext = cloud.getWXContext()
  //读取请求中的房主id
  let userID = wxContext.OPENID

  // 获取请求中的房间id
  let roomID = event.roomID
  // 获取请求中的玩家最后买单玩家的昵称
  let buyerName = event.buyerName
  // 获取请求中最后确定的数字
  let number = event.number

  // 获取数据库实例
  const db = cloud.database()

  // 更新房间游戏状态
  db.collection('room').doc(roomID).update({
    data:{
      status: 3,
      buyer_name: buyerName,
    }
  }).then(res=>{
    console.log(res)
  })
  
  // 写结束游戏推送日志
  db.collection('game_log').add({
    data:{
      room_id: roomID,
      action: 'endGame',
      user_id: userID,
      user_name: buyerName,
      info: number,
      time: new Date().toLocaleString()
    }
  }).then(res => {
    console.log(res)
  })

  return {
    event,
    ret:1
  }
}


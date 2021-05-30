// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 开始游戏云函数入口函数
exports.main = async (event, context) => {
  // 获取请求中的房间id信息
  let roomID = event.roomID
  
  // 获取数据库实例
  const db = cloud.database()
  
  // 更新房间游戏状态
  db.collection('room').doc(roomID).update({
    data:{
      status: 2
    }
  }).then(res=>{

  })

  // 写开始游戏推送日志
  db.collection('game_log').add({
    data:{
      room_id: roomID,
      action: 'startGame',
      user_id: '',
      info: parseInt(Math.random()*101),
      time: new Date().toLocaleString()
    }
  }).then(res => {
    console.log(res)
  })
  
  return {
    event,
    ret: 1
  }

}

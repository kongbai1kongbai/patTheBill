// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 结束游戏云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //读取请求参数
  let roomID = event.roomID
  let buyerName = event.buyerName
  let number = event.number

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
      user_id: '',
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


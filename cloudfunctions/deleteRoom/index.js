// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 删除房间云函数入口函数
exports.main = async (event, context) => {
  // 获取房间ID
  let roomID = event.roomID

  // 获取数据库实例
  const db = cloud.database()

  //删除对应的房间
  db.collection('room').doc(roomID).remove().then(res=>{
    console.log(res)
  })

  // 房主删除房间推送日志
  db.collection('game_log').add({
    data:{
      room_id: roomID,
      action: 'deleteRoom',
      user_id: '',
      info: '',
      time: new Date().toLocaleString()
    }
  }).then(res => {
    console.log(res)
  })
  return{
    event,
    ret: 1
  }
}


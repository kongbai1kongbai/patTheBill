// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

//用户选择云函数入口函数
exports.main = async (event, context) => {
  // 获取访问上下文
  const wxContext = cloud.getWXContext()
  // 获取请求用户id
  let userID = wxContext.OPENID
  
  //获取请求房间ID
  let roomID = event.roomID
  // 获取请求用户名
  let userName = event.userName
  // 获取请求中所选择的数
  let number = event.number
  
  // 获取数据库实例
  const db = cloud.database()

  //添加用户选择数字游戏日志
  db.collection('game_log').add({
    data:{
      room_id: roomID,
      action: 'chooseNumber',
      user_id: userID,
      user_name: userName,
      info: number,
      time: new Date().toLocaleString()
    }
  }).then(res => {
    console.log(res)
  })

  //确定下一个选择数字的玩家
  let userList = []
  await db.collection('room').doc(roomID).get().then(res=>{
    userList = res.data.user_list
  })
  let index = userList.indexOf(userID)
  let nextUserID = userList[0]
  if(index+1<userList.length){
    nextUserID = userList[index+1]
  }

  //添加通知用户选择数字日志文件
  db.collection('game_log').add({
    data:{
      room_id: roomID,
      action: 'notifyChoose',
      user_id: nextUserID,
      info: '',
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


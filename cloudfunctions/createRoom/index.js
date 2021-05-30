// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 创建房间云函数入口函数
exports.main = async (event, context) => {
  //获取访问上下文
  const wxContext = cloud.getWXContext()
  // 获取用户ID，此处为用户ID为房主ID
  let userID = wxContext.OPENID

  // 获取用户Name
  let userName = event.userName
  // 获取房间总人数
  let totalNum = parseInt(event.totalNum)
  // 获取游戏ID
  let gameID = event.gameID

  // 获取数据库实例
  const db = cloud.database()
  const _ = db.command
  
  //查询room表中该用户是否已存在，如果已存在则返回创建房间失败
  let roomID = -1
  let exist = false 
  await db.collection('room').where({
    user_list:userID,
    status:_.neq(3),
  }).get().then(res=>{
    console.log(res)
    if(res.data.length!=0){
      exist = true
    }
  })
  if (exist){
    return{
      event,
      ret:-1,
      roomID:roomID
    }
  }

  // 在房间表中加入新建的房间记录
  let status = 0
  if(totalNum == 1){ // 判断是否创建的房间只有一个用户
    status = 1
  }
  let success = false
  await db.collection('room').add({
    data:{
      total_num: totalNum,
      exist_num: 1,
      game_id: gameID,
      owner_id: userID,
      user_list: [userID],
      user_names: userName,
      status: status,
      buyer_name: "",
      time: new Date().toLocaleString()
    }
  }).then(res => {
    console.log(res)
    success = true
    roomID = res._id
  })
  if(success){
    return{
      event,
      ret: 1,
      roomID:roomID
    }
  }else{
    return{
      event,
      ret: 0,
      roomID:res.roomID
    }
  }

}


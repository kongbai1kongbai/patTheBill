// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 加入房间云函数入口函数
exports.main = async (event, context) => {
  // 获取请求上下文信息
  const wxContext = cloud.getWXContext()
  // 获取用户ID
  let userID  = wxContext.OPENID

  // 获取房间ID
  let roomID = event.roomID
  // 获取用户昵称
  let userName = event.userName

  // 获取数据库实例
  const db = cloud.database()
  const _ = db.command
  
  let exist = false
  let status = -1
  let userNames = ""
  let retRoomID = ""
  let ownerFlag = 0
  //查询room表中该用户是否已存在，如果已存在则返回该roomID
  await db.collection('room').where({
    user_list:userID,
    status:_.neq(3),
  }).get().then(res=>{
    console.log(res)
    if(res.data.length!=0){
      exist = true
      status = res.data[0].status
      userNames = res.data[0].user_names
      retRoomID = res.data[0]._id
      if(res.data[0].owner_id==userID){
        ownerFlag = 1
      }
    }
  })
  if(exist){
    return{
      event,
      ret: -1,
      status: status,
      userNames: userNames,
      roomID: retRoomID,
      ownerFlag:ownerFlag,
    }
  }

  // 确认请求中roomID是否存在，如果不存在，直接返回
  let room_exist = false
  await db.collection('room').where({
    _id: roomID,
  }).get().then(res=>{
    if(res.data.length!=0){
      room_exist = true
    }
  })
  if(!room_exist){
    return{
      event,
      ret:0,
      status:status,
      userNames:userNames,
      roomID: roomID,
      ownerFlag:ownerFlag,
    }
  }

  let existNum = -1
  let totalNum = -1
  let userList = []
  //查询该房间房间状态，如果不是房前房间处于人数未满的状态，则直接返回
  await db.collection('room').doc(roomID).get().then(res=>{
    console.log(res)
    status = res.data.status
    existNum = res.data.exist_num
    totalNum = res.data.total_num
    userList = res.data.user_list
    userNames =  res.data.user_names
    if(res.data.owner_id==userID){
      ownerFlag = 1
    }
  })
  if(status!=0){
    return{
      event,
      ret:-2,
      status:status,
      userNames:userNames,
      roomID: roomID,
      ownerFlag:ownerFlag,
    }
  }

  //修改room表中对应的房间状态，并修改roon表信息
  existNum++
  console.log('exist_num:', existNum)
  console.log('total_num:', totalNum)
  if(existNum == totalNum){
    status = 1
  }
  console.log('status:', status)
  userList.push(userID)
  userNames = userNames + ',' + userName
  db.collection('room').doc(roomID).update({
    data:{
      exist_num: existNum,
      user_list: userList,
      user_names:userNames,
      status:status,
    }
  })

  // 如果状态变为人数已满，则写可以开始游戏推送日志
  if(status == 1){
    db.collection('game_log').add({
      data:{
        room_id: roomID,
        action: 'startReady',
        user_id: '',
        info: '',
        time: new Date().toLocaleString()
      }
    }).then(res => {
      console.log(res)
    })
  }

  // 写加入房间推送日志
  db.collection('game_log').add({
    data:{
      room_id: roomID,
      action: 'joinRoom',
      user_id: userID,
      info: userNames,
      time: new Date().toLocaleString()
    }
  }).then(res => {
    console.log(res)
  })


  return{
    event,
    ret:1,
    status:status,
    userNames:userNames,
    roomID: roomID,
    ownerFlag:ownerFlag,
  }

}



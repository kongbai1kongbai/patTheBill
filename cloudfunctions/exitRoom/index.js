// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 退出房间云函数入口函数
exports.main = async (event, context) => {
  // 获取请求上下文信息
  const wxContext = cloud.getWXContext()
  // 获取上下文中用户ID
  let userID  = wxContext.OPENID

  // 获取请求中房间ID
  let roomID =  event.roomID

  // 获取数据库实例
  const db = cloud.database()

  let status = -1
  // 判定是否是房主
  let owner_flag = false
  // 从数据库中读出来的房间人数
  let existNum = -1
  // 从数据库读出的用户列表
  let userList = []
  let userNames = ""
  // 根据roomID查询对用对应房间表记录
  await db.collection('room').doc(roomID).get().then(res=>{
    console.log(res)
    userList = res.data.user_list
    userNames = res.data.user_names
    existNum = res.data.exist_num
    status = res.data.status
    if(res.data.owner_id == userID){
      owner_flag = true
    }

  })
  //判断是否是房主，如果是房主，或者正在游戏中，则不用退出
  if(!owner_flag && (status == 0 || status == 1)){
      //修改值
    existNum -= 1
    let index = userList.indexOf(userID)
    if(index>-1){
      userList.splice(index, 1)
    }
    let newUserNames = getNewUserNames(userNames, index)
    // 更新表数据，删除对应用户，并将房间中人数-1
    await db.collection('room').doc(roomID).update({
      data:{
        exist_num: existNum,
        user_list: userList,
        user_names: newUserNames,
        status: 0,
      }
    }).then(res=>{
      console.log(res)
    })

  // 写退出房间推送日志
  db.collection('game_log').add({
    data:{
      room_id: roomID,
      action: 'exitRoom',
      user_id: userID,
      info: newUserNames,
      time: new Date().toLocaleString()
    }
  }).then(res => {
    console.log(res)
  })
  }
  return{
    event,
    ret: 1
  }
}

// 获取删除对应用户名后的用户名string
function getNewUserNames(userNames, index){
  let userList = userNames.split(',')
  let newUserNames = ''
  for(let i=0;i<userList.length;i++){
    if(i!=index){
      if(i==0){
        newUserNames = userList[i]
      }else{
        newUserNames = newUserNames + ',' + userList[i]
      }
    }
  }
  return newUserNames
}



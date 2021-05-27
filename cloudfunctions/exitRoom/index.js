// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext()

  // 获取用户ID
  let userID  = wxContext.OPENID
  // 获取房间ID
  let roomID =  event.roomID

  // 从数据库中读出来的房间人数
  let existNum = -1
  // 从数据库读出的用户列表
  let usrList = []
  let userNames = ""

  const db = cloud.database()
  
  //根据房间ID号找到该房间
  await db.collection('room').doc(roomID).get().then(res=>{
    console.log(res)
    userList = res.data.user_list
    userNames = res.data.user_names
  })


  //判断是否是房主，如果是房主，则不用退出
  let owner_flag = false
  await db.collection('room').doc(roomID).get().then(res=>{
    if(res.data.owner_id == userID){
      owner_flag = true
    }
  })
  if(!owner_flag){
      //修改值
    existNum -= 1
    let index = usrList.indexOf(userID)
    if(index>-1){
      usrList.splice(index, 1)
    }
    let newUserNames = getNewUserNames(userNames, index)
    console.log(newUserNames)
    // 更新表数据，删除对应用户，并将房间中人数-1
    db.collection('room').doc(roomID).update({
      data:{
        exist_num: existNum,
        user_list: usrList,
        user_names: newUserNames,
      }
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



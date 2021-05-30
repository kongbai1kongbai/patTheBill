// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 判断是否在房间中云函数入口函数
exports.main = async (event, context) => {
  // 获取请求上下文信息
  const wxContext = cloud.getWXContext()
  // 读取上下文中用户id
  let userID = wxContext.OPENID

  // 判断该用户是否已经在房间中，如果在房间中，则返回对应的房间id
  let ret = 0
  let roomID = ''
  const db = cloud.database()
  const _ = db.command
  await db.collection('room').where({
    user_list:userID,
    status:_.neq(3),
  }).get().then(res=>{
    console.log(res)
    if(res.data.length!=0){
      ret = 1
      roomID = res.data[0]._id
      }
  })
  return {
    event,
    ret: ret,
    roomID:roomID
  }
}
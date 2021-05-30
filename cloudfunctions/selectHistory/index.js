// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 获取历史记录云函数入口函数
exports.main = async (event, context) => {
 // 请求中上下文信息
  const wxContext = cloud.getWXContext()
  //获取请求参数
  let userID = wxContext.OPENID

  // 获取数据库实例
  const db = cloud.database()

  // 从room表中查询相应记录并返回历史记录对象列表
  let historyObjList = []
  await db.collection('room').where({
    user_list:userID,
    status:3
  }).get().then(res=>{
    console.log("res",res)
    for(let i = 0;i<res.data.length;i++){
      let h = res.data[i]
      console.log(h)
      let historyObj = {}
      historyObj.roomID = h._id
      historyObj.time = h.time
      historyObj.gameID = h.game_id
      historyObj.buyerName =  h.buyer_name
      if(userID == h.owner_id){
        historyObj.ownerFlag = true
      }else{
        historyObj.ownerFlag = false
      }
      historyObjList.push(historyObj)
    }
  })
  return {
    event,
    history: historyObjList
  }
}
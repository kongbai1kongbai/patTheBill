
// 云函数入口
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// login云函数入口
exports.main = async (event, context) => {
  // 获取请求上下文信息
  const wxContext = cloud.getWXContext()

  // 返回请求中的用户id
  return {
    event,
    ret: 1,
    userID: wxContext.OPENID
  }
}


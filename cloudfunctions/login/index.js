// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')


// 测试同步

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  console.log("date:", new Date())
  console.log('date:', new Date().toLocaleString())
  console.log("date:",getCurrentTime())
  return {
    event,
    ret: 1,
    userID: wxContext.OPENID
  }
}

function getCurrentTime(){
  let dateTime = new Date()
  let currentTime = ""
  let year = dateTime.getFullYear()
  let month = dateTime.getMonth()+1
  let date = dateTime.getDate()
  let hour = dateTime.getHours()
  let minute = dateTime.getMinutes()
  let second = dateTime.getSeconds()
  currentTime = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
  return currentTime
}


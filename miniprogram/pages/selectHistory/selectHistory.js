Page({
  data: {
    history: []
  },
  onLoad: function () {
    let that = this;
    wx.cloud.callFunction({
      name:'selectHistory',
      data: {
        userID: '', 
      },
      success: function(res) {
        console.log(res)
        that.setData({
          history: res.result.history
        })
      }
    })
  }
})
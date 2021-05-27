// pages/gameRoom/gameRoom.js
Page({
  data: {
    number: '',
    all: '',
    roomID: '',
    userID: '',
    userName: '',
    //注释
    ranNum: 50,
    start: 1,
    end: 100,
    ownerFlag: "0",
    userNames: '',
    isShowStartGame: false,
    isDisabled: true, //删除按钮屏蔽
    dis_start:true,//开始按钮屏蔽
    dis_input:true, // 输入按钮屏蔽
    isShowBoom: false,
    isShowRoomId: false,
  },
  onShow: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  // 加载页面时执行的代码
  onLoad: function(options){
    console.log(options)
    //判断房前人数是否已满
    if(options.status=='1'){
      this.setData({
        dis_start: false
      })
    }
    //判断当前是否已经在游戏中了
    if(options.status=='2'){
      this.setData({
        isShowStartGame: true
      })
    }
    this.setData({
      roomID:options.roomID,
      userNames:options.userNames,
      ownerFlag:options.ownerFlag,
    })
    if(this.data.ownerFlag=="1"){
      this.setData({
        isDisabled:false,
        dis_input:false,
      })
    }

    // 执行后台监听
    this.initWatch()

    // 读取缓存内容
    let user = wx.getStorageSync('user')
    let userID = wx.getStorageSync('userID')
    this.setData({
      userID: userID,
      userName: user.nickName,
    })
  },
  async initWatch(){
    const db = wx.cloud.database()
    console.log('开始监听')
    console.log('roomID:',this.data.roomID)
    this.messageListener = db.collection('game_log').where({
      room_id: this.data.roomID
    }).watch({
      onChange:this.onRealtimeMessageSnapshot.bind(this),
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
  onRealtimeMessageSnapshot(snapshot){
    console.log('收到消息:', snapshot)
    if(snapshot.type == 'init') return 
    if(snapshot.docChanges.length==0) return 
    let message = snapshot.docChanges[0].doc
    if(message.action == "joinRoom"){ //用户加入房间推送消息
      console.log('joinRoom:', message.info)
      this.setData({
        userNames:message.info
      })
    }else if(message.action == "exitRoom"){ //用户退出房间推送消息
      console.log('exitRoom', message.info)
      this.setData({
        userNames:message.info
      })
    }else if(message.action == "deleteRoom"){ //用户删除房间推送消息
      wx.showToast({
        title: '游戏已被房主删除',
      })
      wx.redirectTo({
        url: '../index/index',
      })
    }else if(message.action == "startReady"){ // 人数已满可以开始游戏推送消息
      if(this.data.ownerFlag=="1"){
        this.setData({
          dis_start: false,
        })
      }
    }else if(message.action == "startGame"){ //房主开始游戏推送消息
      this.setData({
        isShowStartGame: true
      })
      console.log('ranNum:', message.info )
      wx.showToast({
        title: '游戏开始',
      })
      this.setData({
        ranNum: message.info
      })
    }else if(message.action == "endGame"){ // 游戏结束推送消息
      wx.showToast({
        title: '恭喜老板',
      })
      this.setData({
        isShowBoom: true,
        start: message.info,
        end: message.info
      })
    }else if(message.action == "notifyChoose"){ //通知用户选择数字推送消息
      console.log('notify')
      if(message.user_id == this.data.userID){
        wx.showToast({
          title: '轮到您输入数字',
        })
        this.setData({
          dis_input:false,
        })
      }
    }else if(message.action == "chooseNumber"){ // 用户选择的数字推送消息
      let roomID = this.data.roomID
      let num = parseInt(message.info)
      if(num > this.data.ranNum){
        console.log('大于')
        this.setData({
          end: num,
        })
      }else if(num < this.data.ranNum){
        console.log('小于')
        this.setData({
          start: num,
        })
        console.log(this.data.number)
      }else if(num == this.data.ranNum && this.data.ownerFlag){
        console.log('游戏结束')
        this.setData({
          isShowBoom: true
        })
        wx.cloud.callFunction({
          name: 'endGame',
          data: {
            roomID: roomID,
            buyerName:message.user_name,
            number:num,
          },
          success: function(res) {
            console.log(res.result)
          }
        })
      }
      this.setData({
        number: message.info,
      })
    }
  },
  getNumber: function(e) {
    // 数字显示框--用户输入的数据
    const temp = e.currentTarget.dataset.text;
    this.data.all += temp;
    this.setData({
      number: this.data.all
    })
  },
  gameStart: function() {
    // 用户输入的数据
    const numInput = parseInt(this.data.all);
    // 产生一个随机数（该数字为数字炸弹）
    console.log(this.data.ranNum)
    if (!numInput || numInput < this.data.start || numInput > this.data.end) {
      wx.showToast({
        title: '请输入正确数据',
      })
      return
    }
    wx.cloud.callFunction({
      name: 'chooseNumber',
      data: {
        roomID: this.data.roomID,
        userID: this.data.userID,
        userName: this.data.userName,
        number: numInput
      },
      success: function(res) {
        console.log(res.result)
      }
    })
    this.setData({
      dis_input:true
    })
  },
  delNumber: function() {
    // 清空输入的数据
    this.setData({
      all: '',
      number: '',
    })
  },
  // 开始游戏
  showStartGame: function() {
    this.setData({
      isShowStartGame: true
    })

    wx.cloud.callFunction({
      name: 'startGame',
      data: {
        roomID: this.data.roomID,
      },
      success: function(res) {
        console.log(res.result)
      }
    })
  },
  // 退出
  outRoom: function() {
    wx.cloud.callFunction({
      name: 'exitRoom',
      data: {
        roomID: this.data.roomID,
      },
      success: function(res) {
        console.log(res)
      }
    })
    wx.redirectTo({
      url: '../index/index',
    })
  },
  // 删除
  deleteRoom: function() {
    this.setData({
      isDisabled: true
    })
    console.log('1')
    wx.cloud.callFunction({
      name: 'deleteRoom',
      data: {
        roomID: this.data.roomID,
      },
      success: function(res) {
        wx.redirectTo({
          url: '../index/index',
        })
      }
    })
  },
  ShowRoomId: function(e) {
    this.setData({
      roomID: this.data.roomID,
    })
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
})
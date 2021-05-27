//index.js
const app = getApp()

Page({
  data: { 
    // 是否展示创建房间弹窗
    showDialog:false,
    // 是否展示加入房间弹窗
    showRoom: false,
    isShowUserName: false,
    userInfo: null,
    room: '',
    people: '1',
  },
  getUserProfile: function() {
    // 获取用户ID
    wx.cloud.callFunction({
      name: 'login',
      data: {
      },
      success: function(res) {
        wx.setStorageSync('userID', res.result.userID)
      }
    })
    //获取用户昵称信息
    wx.getUserProfile({
      desc: '授权登录',
      success: (res) => {
        console.log(res)
        let user = res.userInfo;
        wx.setStorageSync('user', user);//保存用户信息到本地缓存
        this.setData({
          isShowUserName: true,
          userInfo: user,
        })
      },
    })
  },
  onShow: function(options) {
    this.getUserProfile();
    var user = wx.getStorageSync('user'); //从本地缓存取用户信息
    if (user && user.nickName) { //如果本地缓存有信息就显示本地缓存
      this.setData({
        isShowUserName: true,
        userInfo: user,
      })
    }
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  // 创建房间
  click: function() {
    this.setData({
      showDialog: !this.data.showDialog
    })

  },
  // 取消
  cancel_event: function(e) {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },
  // 确定
  confirm_event: function(e) {
    if(typeof(e.detail.people)=="undefined"){
      return 
    }
    console.log('createRoom:',e)
    // 点击弹窗确定 进入房间页面
    this.setData({
      people: e.detail.people
    })

    let nickName = this.data.userInfo.nickName
    let status = 0
    if(this.data.people == '1'){
      status = 1
    }

    if (this.data.people == '') {
      wx.showToast({
        title: '请输入游戏人数',
      })
    } else {
      wx.cloud.callFunction({
        name: 'createRoom',
        data: {
          totalNum: this.data.people,
          gameID: '1',
          userName:nickName
        },
        success: function(res) {
          console.log(res.result)
          if(res.result.ret==1){
            wx.navigateTo({
              url: '../gameRoom/gameRoom?roomID='+res.result.roomID+'&&userNames='+nickName+'&&ownerFlag=1&&status='+status,
            })
          }else{
            wx.showToast({
              title: '创建房间失败',
              icon: 'error',
            })
          }
        }
      })
    }
  },
  // 加入房间
  joinRoom: function() {
    this.setData({
      showRoom: !this.data.showRoom
    })
    
  },
  // 取消
  cancel_room: function(e) {
    this.setData({
      showRoom: !this.data.showRoom
    })
  },
  // 确定
  confirm_room: function(e) {
    if(typeof(e.detail.room) == "undefined"){
      return 
    }
    console.log('joinRoom',e)
    this.setData({
      room: e.detail.room
    });

    console.log(this.data.room)
    let userName = this.data.userInfo.nickName
    let roomID = this.data.room
    if (roomID.length == 0) {
      wx.showToast({
        title: '请输入正确房号',
      })
    } else {

      wx.cloud.callFunction({
        name:'joinRoom',
        data: {
          userName: userName,
          roomID: roomID
        },
        success: function(res) {
          console.log(res)
          if(res.result.ret == -1 && res.result.status!=3){
            wx.showToast({
              title: '已在房间中',
            })
            wx.navigateTo({
              url: '../gameRoom/gameRoom?roomID='+res.result.roomID+'&&userNames='+res.result.userNames+'&&ownerFlag='+res.result.ownerFlag+'&&status='+res.result.status,
            })
          }else if(res.result.ret == 1){
            wx.navigateTo({
              url: '../gameRoom/gameRoom?roomID='+res.result.roomID+'&&userNames='+res.result.userNames+'&&ownerFlag='+res.result.ownerFlag+'&&status='+res.result.status,
            })
          }else{
            wx.showToast({
              title: '加入房间失败'+ res.result.status,
              icon: 'error',
            })
          }
        }
      })
    }
  },

  selectHistory: function() {
    wx.navigateTo({
      url: '../selectHistory/selectHistory',
      })
  }
})

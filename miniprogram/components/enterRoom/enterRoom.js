Component({
  properties: {
    title: {
      type: String,
      value: '房间号'
    },
    room_cancel: {
      type: String,
      value:'取消',
    },
    room_confirm: {
      type: String,
      value: '确定',
    }
  },
  data: {
    room: ''
  },
  methods: {
    // 获取input value值
    getInputValue: function(e) {
      this.setData({
        room: e.detail.value
      })
      var myEventDetail = {
        room: this.data.room
      }
      this.triggerEvent('roomIdConfirm',myEventDetail)
    },
    // 取消按钮
    roomCancel: function() {
      var myEventDetail = {}
      var myEventOption = {
        bubbles: false
      }
      this.triggerEvent('roomIdCancel',myEventDetail,myEventOption)
    },
    roomConfirm: function() {
      if (this.data.room.length == 0) {
        wx.showToast({
          title: '请输入正确的房间号',
        })
      }
      var myEventDetail = {
        properties: this.propertise
      }
      var myEventOption = {
        bubbles: false
      }
      this.triggerEvent('roomIdConfirm', myEventDetail, myEventOption)
    }
  }
})
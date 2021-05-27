Component({
  properties: {
    title: { // 属性名
      type: String,
      value: '创建房间'
    },
    txt_cancel: {
      type:String,
      value:'取消',
    },
    txt_confirm: {
      type: String,
      value: '确定',
    }
  },
  data: {
    items: [
      {name: 'one', value: '数字炸弹'},
    ],
    people: ''
  },
   
  methods: {
    // 获取input值
      getPeopleNumber: function(e) {
        console.log(e)
        this.setData({
          people: e.detail.value
        })
        var myEventDetail = {
          people: this.data.people
        }
        console.log(myEventDetail.people)
        this.triggerEvent('confirm',myEventDetail)
      },
    // 取消
      cancel: function() {
        // 定义触发事件 点击取消关闭弹窗
        var myEventOption = {
          bubbles: false
        }
        this.triggerEvent('cancel', myEventOption)

      },
      // 确定
      confirm: function() {
        var myEventDetail = {
          properties: this.properties
        }
        var myEventOption = {
          bubbles: false
        }
        this.triggerEvent('confirm', myEventDetail, myEventOption)
      },
      
    },
})
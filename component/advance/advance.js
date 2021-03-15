// component/advance.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    ikonw(){
      this.setData({
        flag:false
      })
      wx.setStorageSync('faa', false);
    },
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.setData({
        flag: wx.getStorageSync('faa')
      })
    }
  }
})
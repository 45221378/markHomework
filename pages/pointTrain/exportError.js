// pages/pointTrain/exportError.js
var ajax = require("./../../utils/ajax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    section_name: "",
    downNet: '',
    showNet: '',
    showDownFlag: null
  },
  copyText(e) {
    const {
      content
    } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: content,
      success: function (res) {
        // console.log(res)
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  downNet(e) {
    let {
      downNet
    } = this.data;
    wx.showLoading({
      mask: true,
      title: '正在生成预览文件',
    })
    wx.downloadFile({
      url: downNet,
      header: {},
      success: function (res) {
        wx.hideLoading();
        if (res.errMsg == "downloadFile:ok") {

        } else {
          wx.showToast({
            title: '文件预览失败',
            icon: 'none',
            duration: 2000
          })
        }
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            wx.showToast({
              title: '文件预览成功',
              icon: 'none',
              duration: 2000
            })
          },
          fail: function (res) {},
          complete: function (res) {}
        })
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '下载文件失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function (res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      subjectid,
      stageid,
      variant,
      sectionname,
      download,
      source
    } = options;
    // console.log(options)
    if (source && source == 2) {
      this.setData({
        section_name: sectionname,
        downNet: download,
        showDownFlag: 1
      })
    } else {
      let token = wx.getStorageSync('token');
      let url = wx.getStorageSync('requstURL') + 'homework/wrong/questions/download';
      let data = {
        subject_id: subjectid,
        stage_id: stageid,
        variant: variant,
        pdf_name: sectionname,
        token: token,
        loading: '错题集生成中...'
      };
      ajax.requestLoad(url, data, 'GET').then(res => {
        if (res.code === 20000) {
          this.setData({
            section_name: sectionname,
            downNet: res.download_link,
            showDownFlag: 1
          })
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
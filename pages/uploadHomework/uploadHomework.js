var ajax = require("./../../utils/ajax.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    section_id: '',
    section_name: '',
    imgs: [],
    sendImg: '',
    successHint: false,
    disableBtn: true,
    ossInfo: '',
    worksImgs: [],
    psdSeer: false,
    psdFocusSeer: true,
    pwdValSeer: '',
  },
  backoutSeer() {
    this.setData({
      psdSeer: false,
      pwdValSeer: ''
    })
    wx.showTabBar({})
  },
  getFocusSeer: function () {
    this.setData({
      psdFocusSeer: true
    });
  },
  inputPwdSeer: function (e) {
    this.setData({
      pwdValSeer: e.detail.value
    });
  },
   // 输入监管密码成功后，才能正式进入
   surepsdSeer() {
    let {
      pwdValSeer
    } = this.data;
    if (pwdValSeer.length === 4) {
      let url = wx.getStorageSync('requstURL') + 'user/monitor/password/check';
      let token = wx.getStorageSync('token');
      let data = {
        token: token,
        monitor_password: pwdValSeer
      }
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code === 20000) {
          this.setData({
            psdSeer: false,
            pwdValSeer: ''
          })
        } else {
          wx.showToast({
            title: '监管密码输入错误，请重新输入',
            icon: 'none',
            duration: 1000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入4位数字监管密码',
        icon: 'none',
        duration: 1000
      })
    }
  },
  addImg(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;
        var allLength = tempFilePaths.length + imgs.length;
        if (allLength > 10) {
          wx.showToast({
            title: '最多上传10张图',
            icon: 'none',
            duration: 2000
          })
        } else {
          for (var i = 0; i < tempFilePaths.length; i++) {
            imgs.push(tempFilePaths[i]);
          }
          if (imgs.length > 0) {
            that.setData({
              imgs: imgs,
              disableBtn: false
            });
          } else {
            that.setData({
              imgs: imgs,
              disableBtn: true
            });
          }
        }

      }
    })
  },
  deleteImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    if (imgs.length > 0) {
      that.setData({
        imgs: imgs,
        disableBtn: false
      });
    } else {
      that.setData({
        imgs: imgs,
        disableBtn: true
      });
    }
  },
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },

  handelUpload(i) {
    const { section_id, imgs, ossInfo } = this.data;
    return new Promise((resolve) => {
      wx.uploadFile({
        url: ossInfo.endpoint,
        filePath: imgs[i],
        name: 'file',
        header: {
          "Content-Type": 'multipart/form-data'
        },
        formData: {
          "name": `${ossInfo.dir_prefix}/${section_id}/${i}.png`,
          "key": `${ossInfo.dir_prefix}/${section_id}/${i}.png`,
          "policy": ossInfo.policy,
          "OSSAccessKeyId": ossInfo.OSSAccessKeyId,
          "success_action_status": '200',
          "signature": ossInfo.signature,
        },
        success: (result) => {
          // console.log(result)
          if (result.statusCode == 200) {
            resolve(`${ossInfo.endpoint}/${ossInfo.dir_prefix}/${section_id}/${i}.png`)
          } else {
            wx.showToast({
              title: '图片上传失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: () => {
          wx.showToast({
            title: '图片上传失败',
            icon: 'none',
            duration: 2000
          })
        },
        complete: () => {
          // console.log(JSON.stringify(sendImg))

        }
      });
    })
  },

  // 上传到oss上面换取路径
  async uploadFiles() {
    const { section_id, imgs, ossInfo } = this.data;
    wx.showLoading({
      title: '正在上传中...'
    })
    let ret = []
    for (let i = 0; i < imgs.length; i++) {
      let a = await this.handelUpload(i)
      ret.push(a)
    }
    return ret
  },
  async sureImg() {
    const { disableBtn, section_id } = this.data;
    if (!disableBtn) {
      let result = await this.uploadFiles()
      // console.log(result.join(), 'result')
      let that = this;
      let url = wx.getStorageSync('requstURL') + 'homework/image/upload';
      let token = wx.getStorageSync('token');
      let data = {
        token: token,
        section_id: section_id,
        images: result.join()
      };
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code === 20000) {
          that.setData({
            successHint: true 
          })
        }
      })
    }
  },
  close() {
    this.setData({
      successHint: false
    })
  },
  sureMark() {
    const { section_id } = this.data
    wx.reLaunch({
      url: `/pages/markWrongList/markWrongList?section_id=${section_id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getPageData(){
    //发送请求调取上传图片所需要的数据
    let url = wx.getStorageSync('requstURL') + 'common/ali/signature';
    let token = wx.getStorageSync('token');
    ajax.requestLoad(url, { token: token }, 'GET').then(res => {
      if (res.code === 20000) {
        this.setData({
          ossInfo: res.kwargs
        })
      }
    })
  },
  onLoad: function (options) {
    const { section_id, section_name,thirdFrom } = options;
    this.setData({
      section_name: section_name,
      section_id: section_id,
      from: thirdFrom
    })
    //如果用户打开了监管密码，则需要输入监管密码才能查看答案
    let monitor_moudle = wx.getStorageSync('monitor_moudle');
    if(monitor_moudle==1&&thirdFrom=='third'){
      this.setData({
        psdSeer: true,
      })
    }
    this.getPageData();
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
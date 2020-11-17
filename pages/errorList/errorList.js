// pages/errorList/errorList.js
var ajax = require("./../../utils/ajax.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    primary: [{
        name: '语文',
        id: 14,
        img: '/images/icon-subject/Chinese.png'
      },
      {
        name: '数学',
        id: 15,
        img: '/images/icon-subject/m.png'
      },
    ],
    middle: [{
        name: '语文',
        id: 14,
        img: '/images/icon-subject/Chinese.png'
      },
      {
        name: '数学',
        id: 15,
        img: '/images/icon-subject/m.png'
      },
      {
        name: '英语',
        id: 17,
        img: '/images/icon-subject/En.png'
      },
      {
        name: '物理',
        id: 16,
        img: '/images/icon-subject/biology.png'
      },
      {
        name: '化学',
        id: 18,
        img: '/images/icon-subject/chemistry.png'
      },
      // { name: '道法', id: 20, img: '/images/icon-subject/moralityandlaw.png' },
      {
        name: '历史',
        id: 21,
        img: '/images/icon-subject/history.png'
      }
    ],
    x: 260,
    y: 460,
  },
  gologin() {
    wx.navigateTo({
      url: `/pages/login/login`,
    })
  },
  scanHandleResult(section_id) {
    let url = wx.getStorageSync('requstURL') + 'homework/info';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      section_id: section_id
    };
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        if (!res.isBind) {
          wx.showModal({
            title: "提示",
            content: `“${res.section.name}章节”未入库，请联系管理员`,
            icon: 'none',
            duration: 2000,
            showCancel: false
          });
        } else {
          let section_name = res.section_name;
          if (res.image_status == 0 && res.tag_status == 0) {
            wx.navigateTo({
              url: `/pages/uploadHomework/uploadHomework?section_id=${section_id}&section_name=${section_name}`,
            })
          } else if (res.tag_status == 0) {
            wx.navigateTo({
              url: `/pages/markWrongList/markWrongList?section_id=${section_id}`,
            })
          } else {
            wx.navigateTo({
              url: `/pages/workReport/workReport?section_id=${section_id}&section_time=${res.modified}`,
            })
          }
        }
      } else {
        var _this = this;
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
          complete: function () {
            setTimeout(() => {
              _this.loginSuccessShow();
            }, 1500)
          }
        })
      }
    })
  },
  gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
  },
  scancode: function () {
    let that = this;
    const {
      loginFlag
    } = this.data;
    if (loginFlag) {
      // 允许从相机和相册扫码
      wx.scanCode({
        success(res) {
          if (res.result) {
            let result = res.result;
            let section_id = res.result.split(',')[0];
            // if (result.indexOf('https://172.17.250.193') > -1) {   //正式验证
            if (result.indexOf('http://fdtest.canpoint.net') > -1) { //测试验证
              let url = wx.getStorageSync('requstURL') + 'user/third/auth';
              let token = wx.getStorageSync('token');
              let data = {
                token: token,
                redirect_url: result
              };
              ajax.requestLoad(url, data, 'POST').then(res => {
                const {
                  code
                } = res;
                if (code == 20000) {}
              })
            } else if (result.indexOf('https://zyzs.canpoint.net/section/qrcode') > -1) {
              let path = res.result.split('?')[1].split('=')[1];
              let section_id_split = decodeURIComponent(path).split(',')[0];
              console.log(path)
              console.log(section_id_split)
              that.scanHandleResult(section_id_split);
            } else if (section_id.length == 8) {
              that.scanHandleResult(section_id);
            } else {
              wx.hideTabBar({
                success: function () {
                  wx.hideLoading();
                  that.setData({
                    errorCode: true,
                  })
                }
              })

            }
          }

        },
        fail: (res) => {
          
        }
      })
    } else {
      this.setData({
        bounceInUp: "arotate",
      })
      setTimeout(() => {
        this.setData({
          bounceInUp: "",
        })
      }, 600);
    }
  },
  goWrongList(e) {
    const {
      loginFlag
    } = this.data;
    const {
      subjectid,
      stageid
    } = e.currentTarget.dataset;
    if (loginFlag) {
      wx.navigateTo({
        url: `/pages/wrongQuesTable/wrongQuesTable?subjectid=${subjectid}&stageid=${stageid}`,
      })
    } else {
      this.setData({
        bounceInUp: "arotate",
      })
      setTimeout(() => {
        this.setData({
          bounceInUp: "",
        })
      }, 600);
    }

  },
  downpdf() {
    const {
      loginFlag
    } = this.data;
    if (loginFlag) {
      wx.navigateTo({
        url: `/pages/allwrongQues/wrongQuesList`,
      })
    } else {
      this.setData({
        bounceInUp: "arotate",
      })
      setTimeout(() => {
        this.setData({
          bounceInUp: "",
        })
      }, 600);
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let token = wx.getStorageSync('token');
    if (token && token != '') {
      this.setData({
        loginFlag: true
      })
    } else {
      this.setData({
        loginFlag: false
      })
    }
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
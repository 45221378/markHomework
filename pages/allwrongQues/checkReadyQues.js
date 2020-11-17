// pages/allwrongQues/checkReadyQues.js
var ajax = require("./../../utils/ajax.js")
var changeStr = require("./../../utils/replace.js")
const innerAudioContext = wx.createInnerAudioContext();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    subjectid: '',
    stageid: '',
    contentlist: null,
    pageData: [],
    fliterUnderstand: '',
    tipsFlag: false,
    radioFlag: false,
    changeNameFlag: false,
    section_name: '',
    variant: 1
  },
  understand(e) {
    const { id, understand } = e.currentTarget.dataset;
    const { contentlist } = this.data;
    let checkunder = understand === 0 ? 1 : 0;
    let _this = this;
    let url = wx.getStorageSync('requstURL') + 'homework/wrong/question/mark';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      id: id,
      understand: checkunder
    };
    ajax.requestLoad(url, data, 'POST').then(res => {
      if (res.code == 20000) {
        wx.showToast({
          title: `标记${checkunder == 1 ? '掌握' : '没掌握'}成功`,
          icon: 'none',
          duration: 2000
        })
        contentlist.forEach((item, i) => {
          if (item.id === id) {
            _this.setData({
              [`contentlist[${i}]understand`]: checkunder
            })
          }
        })
      }
    })
  },
  deleteques(e) {
    const { id } = e.currentTarget.dataset;
    const { contentlist, subjectid, stageid, addContent } = this.data;
    let _this = this;
    let url = wx.getStorageSync('requstURL') + 'homework/report/question/delete';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      id: id,
      subject_id: subjectid,
      stage_id: stageid
    };
    ajax.requestLoad(url, data, 'DELETE').then(res => {
      if (res.code == 20000) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000
        })
        contentlist.forEach((item, i) => {
          if (item.id === id) {
            contentlist.splice(i, 1)
            _this.setData({
              contentlist,
              addContent: addContent - 1
            })
          }
        })
      }
    })
  },
  getQuesList() {
    const { subjectid, stageid } = this.data;
    let _this = this;
    let url = wx.getStorageSync('requstURL') + 'homework/report/question/list';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      subject_id: subjectid,
      stage_id: stageid,
    };
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        var contentlist = res.wrong_question_list;
        contentlist.map(item => {
          // 处理大题的题干
          if (item.question_data.stem) {
            let indexstemInt = changeStr.changeReplaceNo(item.question_data.stem);
            item.indexstem = '<div style="white-space:pre-wrap;word-wrap:break-word;word-break:break-all">' + indexstemInt + '</div>';
          }
          //给大题的每一个答案，拼接 A B C D
          for (var i in item.question_data.options) {
            item.question_data.options[i] = '<div style="white-space:pre-wrap">' + String.fromCodePoint(parseInt(i) + 65) + '.&nbsp;' + changeStr.changeReplaceNo(item.question_data.options[i]) + '</div>'
          }
          //处理大题的音频地址
          if (item.question_data.audio) {
            let audiohttps = item.question_data.audio.replace('http://', 'https://')
            item.question_data.audio = audiohttps;
            item.question_data.durationTotal = '00:00';
            item.question_data.currentTime = '00:00';
            item.question_data.showaudioImg = 0;
          }
          //如果里面有小题
          if (item.question_data.children.length > 0 && item.question_data.template != 14) {
            item.childrenFlag = true; 
            item.question_data.children.map((itch, idch) => {
              // 处理小题的题干
              if (itch.stem) {
                let indexChildstemInt = changeStr.changeReplaceNo(itch.stem);
                let indexChildP = indexChildstemInt.indexOf('<p>');
                let indexChildstem
                //有的题号带了括号，有的题号没有带括号
                if (indexChildP == 0) {
                  indexChildstem = `${indexChildstemInt.slice(0, 3)}(${idch+1}).${indexChildstemInt.slice(3)}`
                } else {
                  indexChildstem = `(${idch+1}).${changeStr.changeReplaceNo(itch.stem)}`
                }
                itch.indexChildstem = '<div style="white-space:pre-wrap;word-wrap:break-word;word-break:break-all">' + indexChildstem + '</div>';
              } else {
                itch.indexChildstem = `(${idch+1}).`
              }
              //给小题每一个答案，拼接 A B C D
              for (var j in itch.options) {
                itch.options[j] = '<div style="white-space:pre-wrap">' + String.fromCodePoint(parseInt(j) + 65) + '.&nbsp;' + changeStr.changeReplaceNo(itch.options[j]) + '</div>'
              }
            })
          }
        })
        _this.setData({
          contentlist
        })
        // console.log(this.data.contentlist)
      }
    })
  },
  showTips() {
    this.setData({
      tipsFlag: true
    })
  },
  iknow() {
    this.setData({
      tipsFlag: false
    })
  },
  clear() {
    const { subjectid, stageid } = this.data;
    let _this = this;
    let url = wx.getStorageSync('requstURL') + 'homework/report/question/clear';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      subject_id: subjectid,
      stage_id: stageid,
    };
    ajax.requestLoad(url, data, 'DELETE').then(res => {
      if (res.code === 20000) {
        wx.showToast({
          title: '清除成功',
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  export() {
    this.setData({
      radioFlag: true
    })
  },
  playbigaudio(e) {
    const { audiosrc, id } = e.currentTarget.dataset;
    const { contentlist } = this.data;
    innerAudioContext.src = audiosrc;
    innerAudioContext.play();
    var that = this;
    contentlist.forEach((item, i) => {
      if (item.id == id && item.question_data.audio != null && item.question_data.audio != "") {
        that.setData({
          [`contentlist[${i}]question_data.showaudioImg`]: 3,
        })
        setTimeout(() => {
          innerAudioContext.currentTime
          innerAudioContext.onTimeUpdate(() => {
            let durationTotal = changeStr.formatSeconds(innerAudioContext.duration)
            let currentTime = changeStr.formatSeconds(innerAudioContext.currentTime)
            that.setData({
              [`contentlist[${i}]question_data.durationTotal`]: durationTotal,
              [`contentlist[${i}]question_data.currentTime`]: currentTime,
              [`contentlist[${i}]question_data.showaudioImg`]: 1,
            })
          })
        }, 500)
        // 监听音频播放至自然结束的情况下，重置为初始状态
        innerAudioContext.onEnded(() => {
          that.setData({
            [`contentlist[${i}]question_data.currentTime`]: '00:00',
            [`contentlist[${i}]question_data.showaudioImg`]: 0,
          })
        })
      } else {
        that.setData({
          [`contentlist[${i}]question_data.showaudioImg`]: 0,
          [`contentlist[${i}]question_data.currentTime`]: '00:00',
        })
      }
    })
  },
  stopbigaudio(e) {
    const { id } = e.currentTarget.dataset;
    const { contentlist } = this.data;
    var that = this
    contentlist.forEach((item, i) => {
      if (item.id == id && item.question_data.audio != null && item.question_data.audio != "") {
        that.setData({
          [`contentlist[${i}]question_data.showaudioImg`]: 0,
        })
        innerAudioContext.pause();
      }
    })
  },
  changeName() {
    this.setData({
      changeNameFlag: true
    })
  },
  // 修改错题集名称的弹框里面的方法
  getName(e) {
    this.setData({
      errorName: e.detail.value
    })
  },
  sureChange() {
    const { errorName } = this.data;
    if (errorName == '') {
      wx.showToast({
        title: '错题集名称不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        changeNameFlag: false,
        section_name: errorName
      })
      wx.showToast({
        title: '修改成功',
        icon: 'none',
        duration: 2000
      })
    }
  },
  cancleChange() {
    this.setData({
      changeNameFlag: false
    })
  },
  // 导出错题里面的方法
  inputchecked(e){
    const {variant} = e.currentTarget.dataset;
    this.setData({
      variant
    })
  },
  sureCheck() {
    // variant   1包含  2不包含针对训练题    pdf_name
    const { subjectid, stageid, variant, section_name} = this.data;
    wx.redirectTo({
      url: `/pages/pointTrain/exportError?subjectid=${subjectid}&stageid=${stageid}&variant=${variant}&sectionname=${section_name}`,
    });
    this.setData({
      radioFlag: false,
    }) 
  },
  cancleCheck() {
    this.setData({
      radioFlag: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nowTimeDot = new Date()
    let section_name = `${nowTimeDot.getFullYear()}年${nowTimeDot.getMonth() + 1}月${nowTimeDot.getDate()}日定制错题集`;
    const { subjectid, stageid } = options;
    this.setData({
      subjectid,
      stageid,
      section_name
    })
    this.getQuesList()
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
    innerAudioContext.stop();
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
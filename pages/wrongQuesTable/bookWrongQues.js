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
    filteFlag: false,
    fliterUnderstand: null,
    failFlag: false,
    QuesType: null,
    QuesTypeCode: null,
    addContent: 0,
    bounceInUp: '',    //小熊动画
  },

  filteResult() {
    this.setData({
      filteFlag: true
    })
  },
  closeFlag() {
    this.setData({
      filteFlag: false
    })
  },
  else() {
    // console.log('阻止点击白色区域，关闭掉了遮罩层')
  },
  chooseQues() {
    // console.log('点击进行选择')
  },
  addAll() {
    const { subjectid, stageid, sectionid, fliterUnderstand, addContent, contentlist, QuesTypeCode } = this.data;
    if (addContent >= 50) {
      this.setData({
        failFlag: true,
        // alreadyAdd: true
      })
    } else {
      let _this = this;
      let url = wx.getStorageSync('requstURL') + 'homework/section/wrong/question/add';
      let token = wx.getStorageSync('token');
      let data = {
        token: token,
        subject_id: subjectid,
        stage_id: stageid,
        section_id: sectionid
      };
      fliterUnderstand === null ? '' : data.understand = fliterUnderstand;
      QuesTypeCode === null ? "" : data.question_type_id = QuesTypeCode;
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code == 20000) {
          if (res.result_code == 3) {
            this.setData({
              failFlag: true,
            })
          } else {
            wx.showToast({
              title: '所有错题添加成功',
              icon: 'none',
              duration: 2000
            })
            contentlist.forEach((item, i) => {
              _this.setData({
                [`contentlist[${i}]add_status`]: 1,
              })
            })
            _this.setData({
              addContent: res.cache_question_count,
            })
          }

        }
      })
      this.setData({
        bounceInUp: "ashakeR",
      })
      setTimeout(() => {
        this.setData({
          bounceInUp: "",
        })
      }, 500);
    }
  },
  iknow() {
    this.setData({
      failFlag: false
    })
  },

  getQuesList() {
    const { QuesTypeCode, sectionid, fliterUnderstand } = this.data;
    let _this = this;
    let url = wx.getStorageSync('requstURL') + 'homework/section/wrong/question/list';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      section_id: sectionid,
      qs_info: 1,
    };
    QuesTypeCode === null ? '' : data.question_type_id = QuesTypeCode;
    fliterUnderstand == null ? '' : data.understand = fliterUnderstand;
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        var contentlist = res.wrong_question_list;
        contentlist.map(item => {
          // 处理大题的题干
          let indexstem
          if (item.question_data.stem) {
            let indexstemInt = changeStr.changeReplace(item.question_data.stem);
            let indexDisP = indexstemInt.indexOf('>') + 1;
            let indexP = indexstemInt.indexOf('<p');
            if (indexP == 0) {
              indexstem = indexstemInt.slice(0, indexDisP) + item.question_data.index + '. ' + indexstemInt.slice(indexDisP);
            } else {
              indexstem = item.question_data.index + '. ' + indexstemInt;
            }
            item.indexstem = '<div style="white-space:pre-wrap;word-wrap:break-word;word-break:break-all">' + indexstem + '</div>';
          }
          //处理大题的音频地址
          if (item.question_data.audio) {
            let audiohttps = item.question_data.audio.replace('http://', 'https://')
            item.question_data.audio = audiohttps;
            item.question_data.durationTotal = '00:00';
            item.question_data.currentTime = '00:00';
            item.question_data.showaudioImg = 0;
          }
          //不管是否有小题都给大题的每一个答案，拼接 A B C D
          for (var i in item.question_data.options) {
            item.question_data.options[i] = '<div style="white-space:pre-wrap">' + String.fromCodePoint(parseInt(i) + 65) + '.&nbsp;' + changeStr.changeReplace(item.question_data.options[i]) + '</div>'
          }
          //如果里面有小题
          if (item.question_data.children.length > 0 && item.question_data.template != 14) {
            item.childrenFlag = true;
            item.question_data.children.map((itch, idch) => {
              // 处理小题的题干
              if (itch.stem) {
                let indexChildstemInt = changeStr.changeReplace(itch.stem);
                let indexChildP = indexChildstemInt.indexOf('<p>');
                let indexChildstem
                //有的题号带了括号，有的题号没有带括号
                if (indexChildP == 0) {
                  indexChildstem = indexChildstemInt.slice(0, 3) + itch.index + '. ' + indexChildstemInt.slice(3)
                } else {
                  indexChildstem = itch.index + '. ' + changeStr.changeReplace(itch.stem);
                }
                itch.indexChildstem = '<div style="white-space:pre-wrap;word-wrap:break-word;word-break:break-all">' + indexChildstem + '</div>';
              } else {
                itch.indexChildstem = itch.index + '. '
              }
              //给小题每一个答案，拼接 A B C D
              for (var j in itch.options) {
                itch.options[j] = '<div style="white-space:pre-wrap">' + String.fromCodePoint(parseInt(j) + 65) + '.&nbsp;' + changeStr.changeReplace(itch.options[j]) + '</div>'
              }
            })
          }
        })

        var idList = [];
        contentlist.forEach(ic => {
          idList.push(ic.id)
        })
        _this.setData({
          addContent: res.cache_question_count,
          contentlist
        })
        wx.setStorageSync('idList', idList);
        // console.log(this.data.contentlist)
      }
    })
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
  addques(e) {
    const { id } = e.currentTarget.dataset;
    const { contentlist, subjectid, stageid, addContent } = this.data;
    if (addContent >= 50) {
      this.setData({
        failFlag: true
      })
    } else {
      let _this = this;
      let url = wx.getStorageSync('requstURL') + 'homework/report/question/add';
      let token = wx.getStorageSync('token');
      let data = {
        token: token,
        id: id,
        subject_id: subjectid,
        stage_id: stageid
      };
      ajax.requestLoad(url, data, 'POST').then(res => {
        if (res.code == 20000) {
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 2000
          })
          contentlist.forEach((item, i) => {
            if (item.id === id) {
              _this.setData({
                [`contentlist[${i}]add_status`]: 1,
                addContent: res.cache_question_count,
              })
            }
          })
        }
      })
      this.setData({
        bounceInUp: "ashakeR",
      })
      setTimeout(() => {
        this.setData({
          bounceInUp: "",
        })
      }, 500);
    }
  },
  deleteques(e) {
    const { id } = e.currentTarget.dataset;
    const { contentlist, subjectid, stageid } = this.data;
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
            _this.setData({
              [`contentlist[${i}]add_status`]: 0,
              addContent: res.cache_question_count,
            })
          }
        })
      }
    })
    this.setData({
      bounceInUp: "ashakeR",
    })
    setTimeout(() => {
      this.setData({
        bounceInUp: "",
      })
    }, 500);
  },
  seeAdd() {
    const { subjectid, stageid, addContent } = this.data;
    if (addContent > 0) {
      wx.navigateTo({
        url: `/pages/allwrongQues/checkReadyQues?subjectid=${subjectid}&stageid=${stageid}`,
      })
    }
  },
  goQuesDetail(e) {
    const { sectionid, sectionname } = this.data;
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/sortWrongList/sortWrongList?id=${id}&section_id=${sectionid}&section_name=${sectionname}`
    })
  },
  // 查询该错题集下共有多少种题型
  checkQuesType(subjectid, stageid) {
    let _this = this;
    let url = wx.getStorageSync('requstURL') + 'common/subject/question/type';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      subject_id: subjectid,
      stage_id: stageid
    };
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code == 20000) {
        _this.setData({
          QuesType: res.question_list
        })
      }
    })
  },
  bindUnder(e) {
    const { checked } = e.currentTarget.dataset;
    const { fliterUnderstand } = this.data;
    if (fliterUnderstand === checked) {
      this.setData({
        fliterUnderstand: null,
      })
    } else {
      this.setData({
        fliterUnderstand: checked,
      })
    }
  },
  bindType(e) {
    let { typecode } = e.currentTarget.dataset;
    const { QuesTypeCode } = this.data;
    typecode === QuesTypeCode ? this.setData({
      QuesTypeCode: null,
    }) : this.setData({
      QuesTypeCode: typecode,
    })

  },
  bindRest() {
    this.setData({
      fliterUnderstand: null,
      QuesTypeCode: null,
    })
  },
  bindSure() {
    this.setData({
      filteFlag: false
    })
    this.getQuesList()
  },
  playbigaudio(e) {
    const { audiosrc, id } = e.currentTarget.dataset;
    // console.log(id)
    // console.log(audiosrc)

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
            [`contentlist[${i}]question_data.showaudioImg`]: 0,
            [`contentlist[${i}]question_data.currentTime`]: '00:00',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { subjectid, stageid, sectionid, sectionname } = options;
    this.setData({
      subjectid,
      stageid,
      sectionid,
      sectionname
    })
    this.checkQuesType(subjectid, stageid);
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
    this.getQuesList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //暂停播放功能
    innerAudioContext.stop();
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
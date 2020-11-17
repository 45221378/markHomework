var ajax = require("./../../utils/ajax.js")
var changeStr = require("./../../utils/replace.js")
const innerAudioContext = wx.createInnerAudioContext();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    timer : '',      //计时器的方法，便于后期清除计时器
    timer1 : '',      //计时器的方法，便于后期清除计时器
    subjectid: '',
    stageid: '',
    section_id: '',
    cache_question_count: 0,
    alreadyAdd: false,
    image_list: [],
    pageChecked: '',
    pageData: null,
    precent: 0,
    showcontentFlag: false,
    bounceInUp: '',   //小熊抖动的动画
    indexstem111: `根据加、减法各部分间的关系，写出另外两个等式。​<table border='1' cellspacing='0' cellpadding='0' style='width: 293px;'><tbody><tr><td rowspan='2' colspan='1'><img src='http://qp-tiku.oss-cn-beijing.aliyuncs.com/latex2svg/a8e543b37723cc401d1f0caf97d5eee7.svg'/></td><td style='width: 161px;'> </td></tr><tr><td style='width: 161px;'> </td></tr><tr><td rowspan='2' colspan='1'><img src='http://qp-tiku.oss-cn-beijing.aliyuncs.com/latex2svg/7649314e85838a15cee8bb30043f1dd7.svg'/></td><td style='width: 161px;'> </td></tr><tr><td style='width: 161px;'> </td></tr></tbody></table>`,
    indexstem1:`根据加、减法各部分间的关系，写出另外两个等式。​<table border='1' cellspacing='0' cellpadding='0' style='width: 293px;'><tbody><tr><td rowspan='2' colspan='1' style='width: 2px;'><span class='math-tex'>123</span></td><td style='width: 161px;'> </td></tr><tr><td style='width: 161px;'> </td></tr><tr><td rowspan='2' colspan='1' style='width: 2px;'><span class='math-tex'>1235</span></td><td style='width: 161px;'> </td></tr><tr><td style='width: 161px;'> </td></tr></tbody></table>`
  },
  getWrongCount() {
    const { subjectid, stageid, section_id } = this.data;
    let url = wx.getStorageSync('requstURL') + 'homework/wrong/question/list';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      subject_id: subjectid,
      stage_id: stageid,
      time_interval: 1,
      order_method: 1,
      pagesize: 10,
      page: 1,
    };
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        this.setData({
          cache_question_count: res.cache_question_count
        })
      }
    })
  },
  iknow() {
    this.setData({
      failFlag: false
    })
  },
  addWrongQues() {
    const { subjectid, stageid, section_id, cache_question_count } = this.data;

    let token = wx.getStorageSync('token');
    let url = wx.getStorageSync('requstURL') + 'homework/section/wrong/question/add';
    const data = {
      token: token,
      subject_id: subjectid,
      stage_id: stageid,
      section_id: section_id
    }
    ajax.requestLoad(url, data, 'POST').then(res => {
      if (res.code === 20000) {
        if (res.result_code == 3) {
          this.setData({
            failFlag: true
          })
        } else {
          this.setData({
            alreadyAdd: true,
            cache_question_count: res.cache_question_count
          })
          wx.showToast({
            title: '加入错题集完成',
            icon: 'success',
            duration: 2000
          })
        }

      }
    })
    this.setData({
      bounceInUp: "ashakeR",
    })
    this.data.timer1 = setTimeout(() => {
      this.setData({
        bounceInUp: "",
      })
    }, 500);

  },
  seeAdd() {
    const { subjectid, stageid, cache_question_count } = this.data;
    if (cache_question_count > 0) {
      wx.navigateTo({
        url: `/pages/allwrongQues/checkReadyQues?subjectid=${subjectid}&stageid=${stageid}`,
      })
    }
  },
  return() {
    wx.switchTab({
      url: '/pages/scanWork/scanWork',
    })
  },
  clickcut(e) {
    const { imgsrc, imglist } = e.currentTarget.dataset;
    //图片预览
    wx.previewImage({
      current: imgsrc, // 当前显示图片的http链接
      urls: imglist // 需要预览的图片http链接列表
    })
  },
  remarkQues() {
    const { section_id } = this.data;
    wx.navigateTo({
      url: `/pages/markWrongList/markWrongList?section_id=${section_id}`,
    })
  },
  //点击头部，显示不同的题目结构
  // （1）正在播放的音频应该全部结束，且归为为初始状态。
  changeChecked(e) {
    innerAudioContext.stop();
    const { checkedid, showcontent } = e.currentTarget.dataset;
    const { question_list } = this.data;
    let deepquestion_list = JSON.parse(JSON.stringify(question_list));
    console.log(deepquestion_list)
    console.log(checkedid)
    deepquestion_list.forEach(qitem => {
      if (qitem.qid == checkedid) {
        let pageData = [];
        pageData = qitem
        let indexstem
        if (pageData.stem) {
          let indexstemInt = changeStr.changeReplace(pageData.stem);
          let indexDisP = indexstemInt.indexOf('>') + 1;
          let indexP = indexstemInt.indexOf('<p');
          if (indexP == 0) {
            indexstem = indexstemInt.slice(0, indexDisP) + pageData.index + '. ' + indexstemInt.slice(indexDisP);
          } else {
            indexstem = pageData.index + '. ' + indexstemInt;
          }
          pageData.indexstem = '<div style="white-space:pre-wrap;word-wrap:break-word;word-break:break-all">' + indexstem + '</div>';
        }
        for (var i in pageData.options) {
          pageData.options[i] = '<div style="white-space:pre-wrap">' + String.fromCodePoint(parseInt(i) + 65) + '.&nbsp;' + changeStr.changeReplace(pageData.options[i]) + '</div>'
        }
        //处理大题的音频地址
        if (qitem.audio) {
          let audiohttps = qitem.audio.replace('http://', 'https://')
          pageData.audio = audiohttps;
          pageData.durationTotal = '00:00';
          pageData.currentTime = '00:00';
          pageData.showaudioImg = 0;
        }
        //上面的情况是因为，无论是否有小题，都要对其进行处理。
        if (pageData.children.length > 0) {
          pageData.children.forEach((itch, itdex) => {
            // itch.index = `(${itdex + 1})`;
            itch.myanswerFlag = false;
            pageData.childrenFlag = true;
            for (var j in itch.options) {
              itch.options[j] = '<div style="white-space:pre-wrap">' + String.fromCodePoint(parseInt(j) + 65) + '.&nbsp;' + changeStr.changeReplace(itch.options[j]) + '</div>'
            }
            //处理小题的题干
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

            //小题多答案的情况下, 把答案拼接，用逗号分开
            let newAnwsers = ''
            itch.answers.forEach(itAn => {
              // 判断题，把后端返回的正确的 
              if (itch.template == 6 || itch.template == 24) {
                newAnwsers = itAn.toString() == 0 ? '错' : '对'
              } else {
                newAnwsers = newAnwsers + itAn.toString() + ' &nbsp;&nbsp;';
              }
            })
            itch.newAnwsers = '<div style="white-space:pre-wrap">' + newAnwsers + '</div>';
            // 打错了的情况下，客观题显示错误答案，主观题显示x
            if (itch.right == 0) {
              //如果在有小题的情况下，答错了。
              //判断到底是显示错误的答案，还是在显示 X
              var alltemplate = [1, 2, 3, 4, 25, 6, 19, 14, 22, 29];
              if (alltemplate.indexOf(itch.template) > -1) {
                itch.showErrorAnswer = true;
              } else {
                itch.showErrorAnswer = false;
              }
            }
          })
        } else {
          pageData.childrenFlag = false;
          pageData.myanswerFlag = false;
          //多答案的情况下
          let newAnwsers = ''
          pageData.answers.forEach(itAn => {
            // 判断题，把后端返回的正确的 
            if (pageData.template == 6 || pageData.template == 24) {
              newAnwsers = itAn.toString() == 0 ? '错' : '对'
            } else {
              newAnwsers = newAnwsers + itAn.toString() + ' &nbsp;&nbsp;';
            }
          })
          pageData.newAnwsers = '<div style="white-space:pre-wrap">' + newAnwsers + '</div>';
          //判断到底是显示错误的答案，还是在显示 X
          var alltemplate = [1, 2, 3, 4, 25, 6, 19, 14, 22, 29];
          if (
            alltemplate.indexOf(pageData.template) > -1
          ) {
            pageData.showErrorAnswer = true;
          } else {
            pageData.showErrorAnswer = false;
          }
        }
        this.setData({
          pageData,
          pageChecked: checkedid,
          showcontent,
          showcontentFlag: true
        })
        console.log(pageData)
      }
    })
  },
  // 答案解析进行展开的按钮情况
  seeAnswer(e) {
    const { id, childrenflag, iid } = e.currentTarget.dataset;
    const { pageData } = this.data;
    if (childrenflag) {
      if (pageData.id === id) {
        pageData.children.map((itch, j) => {
          if (itch.index == iid) {
            this.setData({
              [`pageData.children[${j}].myanswerFlag`]: !itch.myanswerFlag
            })
          }
        })
      }
    } else {
      if (pageData.id === id) {
        this.setData({
          [`pageData.myanswerFlag`]: !pageData.myanswerFlag
        })
      }
    }
  },
  handleQues(items) {
    //有小题的情况下，判断是否是半对，全对，全错
    if (items.question_data.children.length > 0) {
      items.question_data.rightlength = 0
      items.question_data.wronglength = 0
      items.question_data.children.forEach(chil => {
        if (chil.right == 0) {
          items.question_data.wronglength++
        } else if (chil.right == 1) {
          items.question_data.rightlength++
        }
      })
      if (items.question_data.wronglength == items.question_data.children.length) {
        items.question_data.right = 0
      } else if (items.question_data.rightlength == items.question_data.children.length) {
        items.question_data.right = 1
      } else {
        items.question_data.right = 2
      }
    }
    return items
  },
  getData() {
    const { section_id } = this.data;
    let url = wx.getStorageSync('requstURL') + 'homework/info';
    let token = wx.getStorageSync('token');
    let data = {
      token: token,
      section_id: section_id,
      paper_status: 1
    };
    ajax.requestLoad(url, data, 'GET').then(res => {
      if (res.code === 20000) {
        let page = []
        let paperStruct = res.paper.paperStruct;
        paperStruct.forEach((paper, paperi) => {
          page.push({
            name: paper.name,
            content: []
          })
          paper.content.forEach((con, coni) => {
            page[paperi].content.push({
              name: con.name,
              content: []
            })
            con.content.forEach((items, index) => {
              if (items.content) {
                page[paperi].content[coni].content.push({
                  name: items.name,
                  content: []
                })
                items.content.forEach((ii, iit) => {
                  page[paperi].content[coni].content[index].content[iit] = this.handleQues(ii)
                })
              } else {
                page[paperi].content[coni].content[index] = this.handleQues(items)
              }
            })
          })
        })
        let precent = ((res.question_count - res.wrong_question_count) * 100 / res.question_count).toFixed(0);
        console.log(page)
        this.setData({
          section_name: res.section_name,
          page,
          precent,
          precentFlag: true,
          section_id: section_id,
          question_count: res.question_count,
          image_list: res.image_list,
          subjectid: res.subject_id,
          stageid: res.stage_id,
          question_list: res.question_list,
          section_name: res.section_name
        })
        this.getWrongCount();
      }
    })
  },
  //点击任何部位关闭题块展示模块
  // （1）正在播放的音频应该全部结束，且归为为初始状态。
  closeQues() {
    const { pageData } = this.data;
    // console.log(pageData)
    //处理大题的音频地址
    if (pageData && pageData.audio) {
      pageData.currentTime = '00:00';
      pageData.showaudioImg = 0;
      innerAudioContext.stop();
    }
    this.setData({
      showcontentFlag: false,
      pageChecked: '',
      pageData
    })
  },
  stopcloseQues() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const { section_id, section_time } = options;
    this.setData({
      section_id,
      section_time,
    })
    innerAudioContext.onPlay(() => {

    })
    innerAudioContext.onPause(() => {

    })
    let content = this.data.indexstem1;
    content = content.replace(/<td(.*?)>/g,'<td>');
    console.log(content)
  },
  playbigaudio(e) {
    const { audiosrc, id } = e.currentTarget.dataset;
    const { pageData } = this.data;
    innerAudioContext.src = audiosrc;
    innerAudioContext.play();
    var that = this
    if (pageData.id == id && pageData.audio != null && pageData.audio != "") {
      that.setData({
        [`pageData.showaudioImg`]: 3,
      })
      this.data.timer = setTimeout(() => {
        innerAudioContext.currentTime
        innerAudioContext.onTimeUpdate(() => {
          let durationTotal = changeStr.formatSeconds(innerAudioContext.duration)
          let currentTime = changeStr.formatSeconds(innerAudioContext.currentTime)
          that.setData({
            [`pageData.durationTotal`]: durationTotal,
            [`pageData.currentTime`]: currentTime,
            [`pageData.showaudioImg`]: 1,
          })
        })
      }, 500)
      // 监听音频播放至自然结束的情况下，重置为初始状态
      innerAudioContext.onEnded(() => {
        that.setData({
          [`pageData.durationTotal`]: '00:00',
          [`pageData.currentTime`]: '00:00',
          [`pageData.showaudioImg`]: 0,
        })
      })
    }
  },
  stopbigaudio() {
    const { pageData } = this.data;
    var that = this
    if (pageData.audio != null && pageData.audio != "") {
      that.setData({
        [`pageData.showaudioImg`]: 0,
      })
      innerAudioContext.pause();
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
    this.getData();
    this.setData({
      alreadyAdd: false,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.closeQues();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 手动的回收定时器
    clearTimeout(this.data.timer);
    clearTimeout(this.data.timer1);
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
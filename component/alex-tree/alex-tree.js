var changeStr = require("../../utils/replace.js")

Component({
  data: {
    pageData: []
  },
  properties: {
    treeBody: {
      type: Array,
      value: [],
    },
    // checkednum: {  //到底是哪一道题展开
    //   type: String,
    //   value: '0'
    // },
  },
  methods: {
    // 子组件抛出点击事件
    tapItem: function (e) {
      // console.log(e)
      const { checkednum, checkedid, list } = e.currentTarget.dataset;
      let pageData = JSON.parse(JSON.stringify(list));
      console.log(pageData)
      // pageData.checkednum = checkednum;
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
      if (pageData.audio) {
        let audiohttps = pageData.audio.replace('http://', 'https://')
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
        checkedid,
        checkednum
      })
      console.log(checkednum)
      this.triggerEvent('tapitem', { checkednum: checkednum });
    },
    stopcloseQues: function (e) {

    },
    // 答案解析进行展开的按钮情况
    seeAnswer: function (e) {
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
    lifetimes: {
      // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
      attached: function () {
        console.log(this.data.treeBody)
      }
    },
    ready: function (e) {
      this.setData({
        isBranch: Boolean(this.data.treeBody.childMenus && this.data.treeBody.childMenus.length),
      });
      console.log(this.data);
    },
  }
})
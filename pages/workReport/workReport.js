var ajax = require("./../../utils/ajax.js")
var changeStr = require("./../../utils/replace.js")
    // const innerAudioContext = wx.createInnerAudioContext();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        timer: '', //计时器的方法，便于后期清除计时器
        timer1: '', //计时器的方法，便于后期清除计时器
        subjectid: '',
        stageid: '',
        section_id: '',
        cache_question_count: 0,
        alreadyAdd: false,
        image_list: [],
        pageData: null,
        precent: 0,
        bounceInUp: '', //小熊抖动的动画
        checkednum: '', //到底是点击哪一个大题号进行的展开
    },
    // 获取错题的总题数  res得到实际的错题总数
    getWrongCount() {
        const {
            subjectid,
            stageid,
        } = this.data;
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
    //点击加入错题集按钮，还有摇摆动画
    addWrongQues() {
        const {
            subjectid,
            stageid,
            section_id,
        } = this.data;
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
    // 点击跳转 进入错题集列表页面
    seeAdd() {
        const {
            subjectid,
            stageid,
            cache_question_count
        } = this.data;
        if (cache_question_count > 0) {
            wx.navigateTo({
                url: `/pages/allwrongQues/checkReadyQues?subjectid=${subjectid}&stageid=${stageid}`,
            })
        }
    },
    return () {
        wx.switchTab({
            url: '/pages/scanWork/scanWork',
        })
    },
    // 点击图片进行预览原图
    clickcut(e) {
        const {
            imgsrc,
            imglist
        } = e.currentTarget.dataset;
        //图片预览
        wx.previewImage({
            current: imgsrc, // 当前显示图片的http链接
            urls: imglist // 需要预览的图片http链接列表
        })
    },
    remarkQues() {
        const {
            section_id
        } = this.data;
        wx.navigateTo({
            url: `/pages/markWrongList/markWrongList?section_id=${section_id}`,
        })
    },

    //递归处理模板数据，然后处理完成以后传递给子组件
    deepHandlePaper(paperStruct) {
        // console.log(paperStruct)
        paperStruct.map(item => {
            if (!item.content) {
                let pageData = item.question_data;
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
                    //有小题的情况下，判断是否是半对，全对，全错
                    pageData.rightlength = 0
                    pageData.wronglength = 0
                    pageData.children.forEach(chil => {
                        if (chil.right == 0) {
                            pageData.wronglength++
                        } else if (chil.right == 1) {
                            pageData.rightlength++
                        }
                    })
                    if (pageData.wronglength == pageData.children.length) {
                        pageData.right = 0
                    } else if (pageData.rightlength == pageData.children.length) {
                        pageData.right = 1
                    } else {
                        pageData.right = 2
                    }
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
                return;
            } else {
                this.deepHandlePaper(item.content)
            }
        })
    },
    //获取页面的题目数据
    getData() {
        const {
            section_id
        } = this.data;
        let url = wx.getStorageSync('requstURL') + 'homework/info';
        let token = wx.getStorageSync('token');
        let data = {
            token: token,
            section_id: section_id,
            paper_status: 1
        };
        ajax.requestLoad(url, data, 'GET').then(res => {
            if (res.code === 20000) {
                let paperStruct = res.paper.paperStruct;
                this.deepHandlePaper(paperStruct)
                // console.log(paperStruct)
                let precent = ((res.question_count - res.wrong_question_count) * 100 / res.question_count).toFixed(0);
                this.setData({
                    section_name: res.section_name,
                    page: paperStruct,
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
    //点击头部，显示不同的题目结构
    // 此方法是父组件接收子组件传过来的题目数据值
    // （1）正在播放的音频应该全部结束，且归位为初始状态。
    receiveNum(e) {
        this.setData({
            checkedid: e.detail.checkedid,
            // pageData: e.detail.pageData,
        })
    },
    //点击任何部位关闭题块展示模块
    // （1）正在播放的音频应该全部结束，且归为为初始状态。
    closeQues() {
        const {
            page
        } = this.data;
        this.deepHandlerAudio(page)
        this.setData({
            checkedid: '',
            page
        })
    },
    //递归处理模板数据，找到对应的数据，然后把里面音频的状态都置位初始状态
    deepHandlerAudio(page) {
        const {
            checkedid,
        } = this.data;
        page.map(item => {
            if (!item.content) {
                if (item.qid == checkedid) {
                    // console.log(item)
                    if (item.question_data && item.question_data.audio) {
                        item.question_data.currentTime = '00:00';
                        item.question_data.showaudioImg = 0;
                    }
                }
                return;
            } else {
                this.deepHandlerAudio(item.content)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(options)
        const {
            section_id,
            section_time
        } = options;
        this.setData({
            section_id,
            section_time,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getData();
        this.setData({
            alreadyAdd: false,
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        this.closeQues();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {


    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
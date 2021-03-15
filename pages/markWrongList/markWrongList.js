// pages/markWrongList/markWrongList.js
var ajax = require("./../../utils/ajax.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        section_id: '',
        section_name: '',
        question_count: 0,
        page: [],
        btnTips: '提交',
        roman: ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ'],
        sendPageArray: [],
        sendQid: "",
        is_video: 0,
    },
    receivePage(e) {
        // console.log(e.detail.page);
        // console.log(e.detail.clickQid);
        const { page } = this.data;
        let newPage = this.deepHandlerPage(page, e.detail.page, e.detail.clickQid);
        this.setData({
            page: newPage
        })
    },
    //递归处理模板数据,自己调用自己，必须return
    deepHandlerPage(handlepage, sendPageArray, sendQid) {
        let changeHandlepage = handlepage;
        changeHandlepage.forEach((item, index) => {
            if (item.content) {
                this.deepHandlerPage(item.content, sendPageArray, sendQid)
            } else {
                if (item.qid == sendQid) {
                    changeHandlepage[index] = sendPageArray
                }
            }
        })
        return changeHandlepage
    },
    //提交以前，先把多维数组转化为一维数组，然后再把 把判断题用户选择的T F，转化成0 ，1发送给后端
    changeSubArr(data) {
        let result = [];
        // 定义选择题的判断题的template字段
        var templateChoose = [1, 2, 3, 4, 6, 25, 14, 22, 29, 19];
        const loop = data => {
            data.forEach((item, indexs) => {
                if (item.content) {
                    loop(item.content)
                } else {
                    //把判断题用户选择的T F，转化成0 ，1发送给后端，新版本提交的部分
                    item.checked = item.checked == '错' ? 0 : item.checked == '对' ? 1 : item.checked
                    if (item.children.length > 0) {
                        item.children.map(it => {
                            it.checked = it.checked == '错' ? 0 : it.checked == '对' ? 1 : it.checked
                        })
                    }
                    result.push(item)
                }

            })
        }
        loop(data)
        var sendIntData = [];
        result.forEach((item, indexs) => {
            // console.log(item)
            if (item.children.length > 0) {
                sendIntData.push({
                    children: [],
                    index: item.index,
                    qid: item.qid,
                    template: item.template,
                    score: item.score,
                    questionType: item.questionType,
                    template_name: item.template_name,
                })
                item.children.map((it, id) => {
                    if (templateChoose.indexOf(it.template) > -1) {
                        sendIntData[indexs].children.push({
                            my_answer: it.checked,
                            index: it.index,
                            qid: it.qid,
                            template: it.template,
                            score: it.score,
                            answers: it.answers,
                            option_count: it.options.length
                        })
                    } else {
                        sendIntData[indexs].children.push({
                            my_answer: it.checked,
                            index: it.index,
                            qid: it.qid,
                            template: it.template,
                            score: it.score
                        })
                    }
                })
            } else {
                if (templateChoose.indexOf(item.template) > -1) {
                    sendIntData.push({
                        my_answer: item.checked,
                        index: item.index,
                        qid: item.qid,
                        template: item.template,
                        score: item.score,
                        questionType: item.questionType,
                        template_name: item.template_name,
                        answers: item.answers,
                        option_count: item.options.length
                    })
                } else {
                    sendIntData.push({
                        my_answer: item.checked,
                        index: item.index,
                        qid: item.qid,
                        template: item.template,
                        score: item.score,
                        questionType: item.questionType,
                        template_name: item.template_name,
                    })
                }
            }
        })
        return sendIntData;
    },
    subTip() {
        const {
            page,
            section_id,
        } = this.data;
        let nowTimeDot = new Date();
        let section_time = `${nowTimeDot.getFullYear()}年${nowTimeDot.getMonth() + 1}月${nowTimeDot.getDate()}日`;
        let url = wx.getStorageSync('requstURL') + 'homework/update';
        let token = wx.getStorageSync('token');
        let sendIntData = this.changeSubArr(page)
            // console.log(sendIntData)
        let data = {
            token: token,
            section_id: section_id,
            question_list: JSON.stringify(sendIntData)
        };
        ajax.requestLoad(url, data, 'POST').then(res => {
            if (res.code === 20000) {
                wx.reLaunch({
                    url: `/pages/workReport/workReport?section_id=${section_id}&section_time=${section_time}`,
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    //循环递归后端返回的数据，拿到整体题目结构内容
    deepGetQues(paperStruct) {
        let changepaperStruct = paperStruct;
        changepaperStruct.forEach((item, index) => {
            if (item.content) {
                this.deepGetQues(item.content)
            } else {
                changepaperStruct[index] = this.handlType(item)
            }
        })
        return changepaperStruct
    },
    // 处理后端返回数据的公共方法
    handlType(items) {
        let item = items.question_data;
        let options, quesType, answers, child, checked;
        let specicalOption = [];
        let newAnwsers = "";
        child = item.children && item.children.length > 0 ? 1 : 0;
        // 自己定义的 quesType  1为单选题  2为多选题 300为客观题  400为特殊题型，7选5  1  2  3 6 25 
        if (child == 0) {
            if (item.template === 1 || item.template === 25) {
                options = item.options ? 'ABCDEFGHIJKLMN'.substr(0, item.options.length) : '';
                quesType = 1;
                answers = item.answers;
                if (answers) {
                    checked = item.my_answer ? item.my_answer : item.answers.toString();
                }
            } else if (item.template === 2 || item.template === 3 || item.template === 4) {
                options = item.options ? 'ABCDEFGHIJKLMN'.substr(0, item.options.length) : '';
                quesType = 2;
                answers = item.answers;
                if (answers) {
                    checked = item.my_answer ? item.my_answer : item.answers.join('');
                }
            } else if (item.template === 6) {
                options = '对错';
                quesType = 6;
                if (item.answers) {
                    answers = item.answers[0][0] == '0' ? "错" : "对";
                    let smy_answer
                    smy_answer = item.my_answer == '0' ? '错' : '对';
                    checked = item.my_answer ? smy_answer : answers;
                }
            } else {
                quesType = 300;
                answers = item.answers;
                if (item.my_answer == 1) {
                    checked = 1;
                } else if (item.my_answer == 0) {
                    checked = 0;
                } else {
                    checked = 1;
                }
            }
            //多答案的情况下
            if (item.answers) {
                item.answers.forEach(item => {
                    newAnwsers = newAnwsers + item.toString() + ' &nbsp;&nbsp;';
                })
            }
        } else {
            //大题里面含有小题的情况
            //特殊题型 7选5
            if (item.template === 14 || item.questionType.id === 22 || item.questionType.id === 29) {
                item.template = 14;
                options = 'ABCDEFG';
                item.options.map((it, id) => {
                    specicalOption.push(
                        options[id] + '.' + it
                    )
                })
                item.children.map((child) => {
                    child.my_answer = child.answers[0][0];
                })
            }
            item.children.map(itch => {
                if (itch.template === 1 || itch.template === 25) {
                    itch.options = itch.options ? 'ABCDEFGHIJKLMN'.substr(0, itch.options.length) : '';
                    itch.templateType = 1;
                    if (!itch.my_answer && itch.answers) {
                        itch.my_answer = itch.answers[0][0];
                    }
                    itch.checked = itch.my_answer
                } else if (itch.template === 2 || itch.template === 3 || itch.template === 4) {
                    itch.options = itch.options ? 'ABCDEFGHIJKLMN'.substr(0, itch.options.length) : '';
                    itch.templateType = 2
                    if (!itch.my_answer && itch.answers) {
                        itch.my_answer = itch.answers.join('');
                    }
                    itch.checked = itch.my_answer ? itch.my_answer : itch.answers.join('');
                } else if (itch.template === 6) {
                    //小题里面含有判断题
                    itch.options = '对错';
                    itch.templateType = 6
                    answers = itch.answers[0][0] == '0' ? "错" : "对";
                    itch.answersPan = answers;
                    let smy_answer
                    smy_answer = itch.my_answer == '0' ? '错' : '对';
                    itch.checked = itch.my_answer ? smy_answer : answers;
                } else {
                    itch.options = '10';
                    itch.templateType = 300;
                    // console.log(itch.answers)
                    // itch.answers = itch.answers[0]
                    // 为此小题标记是否曾经存在标记的问题
                    if (!itch.my_answer) {
                        // console.log('没有标记过错题的情况下')
                        itch.checked = 1;
                        itch.my_answer = 1;
                    } else {
                        // console.log('有标记过错题的情况下')
                        if (itch.my_answer == 1) {
                            itch.checked = 1;
                        } else if (itch.my_answer == 0) {
                            itch.checked = 0;
                        } else {
                            itch.checked = 1;
                        }
                    }
                }
                //小题多答案的情况下
                itch.newAnwsers = "";
                if (itch.answers) {
                    itch.answers.forEach(iit => {
                        itch.newAnwsers = itch.newAnwsers + iit.toString() + ' &nbsp;&nbsp;';
                    })
                }
            })
        }
        let pageData = {};
        pageData = {
            specicalOption: specicalOption,
            answers: answers,
            options: options,
            quesType: quesType,
            checked: checked,
            child: child,
            stem: item.index,
            children: item.children,
            newAnwsers: newAnwsers,
            index: item.index,
            qid: item.qid,
            score: item.score,
            template: item.template,
            questionType: item.questionType,
            template_name: item.template_name,
            live_vedio_image: item.live_vedio_image,
            live_vedio_url: item.live_vedio_url
        }
        return pageData
    },
    onLoad: function(options) {
        const {
            section_id
        } = options;
        let url = wx.getStorageSync('requstURL') + 'homework/info';
        let token = wx.getStorageSync('token');
        let data = {
            token: token,
            section_id: section_id,
            // section_id: 'Sg5f3DOu',
            paper_status: 1
        };
        ajax.requestLoad(url, data, 'GET').then(res => {
            if (res.code === 20000) {
                let paperStruct = this.deepGetQues(res.paper.paperStruct);
                console.log(paperStruct)

                this.setData({
                    section_name: res.section_name,
                    page: paperStruct,
                    section_id: section_id,
                    question_count: res.question_count,
                    is_video: res.is_video
                })
            }
        })
    },
    seeVideo() {
        const { section_id } = this.data;
        wx.navigateTo({
            url: `/pages/markWrongList/playVideo?type=2&section_id=${section_id}`,
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

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
        // 
        // 

    }
})
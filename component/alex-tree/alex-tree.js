var changeStr = require("../../utils/replace.js")
const innerAudioContext = wx.createInnerAudioContext();

Component({
    data: {
        timer: '', //音频播放计时器的方法，便于后期清除计时器
        pageData: []
    },
    properties: {
        treeBody: {
            type: Array,
            value: [],
        },
        checkedid: { //到底是哪一道题展开
            type: String,
            value: '0'
        },
    },
    methods: {
        // 子组件抛出点击事件
        tapItem: function(e) {
            // console.log(e)
            const {
                checkedid
            } = e.currentTarget.dataset;
            const {
                treeBody
            } = this.data;
            if (this.data.checkedid == checkedid) {
                return;
            } else {
                let pageData = []
                treeBody.map(item => {
                        if (item.qid == checkedid) {
                            pageData = item.question_data;
                            //点击头部，显示不同的题目结构
                            // （1）正在播放的音频应该全部结束，且归位为初始状态。
                            //处理大题的音频地址
                            if (pageData && pageData.audio) {
                                pageData.currentTime = '00:00';
                                pageData.showaudioImg = 0;
                                innerAudioContext.stop();
                            }
                        }
                    })
                    // console.log(pageData)
                this.setData({
                    checkedid,
                    pageData
                })
                console.log(this.data.pageData)
                this.triggerEvent('tapitem', {
                    checkedid: checkedid,
                    // pageData: pageData
                });
            }
        },
        //子组件其实也是自己的父组件，所以需要接受这个点击事件，再次进行递归传递
        receiveNum(e) {
            this.triggerEvent('tapitem', {
                checkedid: e.detail.checkedid,
                // pageData: e.detail.pageData //传递这个数据的目的是让父组件能再点击body任何区域的，关闭题目详情的时候，把音频等信息都置为初始信息。
            });
        },
        stopcloseQues: function(e) {},
        playbigaudio(e) {
            const {
                audiosrc,
                id
            } = e.currentTarget.dataset;
            const {
                pageData
            } = this.data;
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
            const {
                pageData
            } = this.data;
            var that = this
            if (pageData.audio != null && pageData.audio != "") {
                that.setData({
                    [`pageData.showaudioImg`]: 0,
                })
                innerAudioContext.pause();
            }

        },
        // 答案解析进行展开的按钮情况
        seeAnswer: function(e) {
            const {
                id,
                childrenflag,
                iid
            } = e.currentTarget.dataset;
            const {
                pageData
            } = this.data;
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
            attached: function() {
                console.log(this.data.treeBody)
            },
            detached: function() {
                // 在组件实例被从页面节点树移除时执行
                // 手动的回收定时器
                clearTimeout(this.data.timer);
                innerAudioContext.stop();
            },
        },
        ready: function(e) {
            innerAudioContext.onPlay(() => {

            })
            innerAudioContext.onPause(() => {

            })
        },
    }
})
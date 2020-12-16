// pages/scanWork/scanWork.js
var ajax = require("./../../utils/ajax.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loginFlag: null,
        blackBlue: false,
        scene: '',
        tips: true,
        x: 460,
        // y: 200,
        y: 480,
        showScan: true,
        title: '',
        primary: [{
                name: '语文',
                id: 14
            },
            {
                name: '数学',
                id: 15
            },
        ],
        middle: [{
                name: '语文',
                id: 14
            },
            {
                name: '数学',
                id: 15
            },
            {
                name: '英语',
                id: 17
            },
            {
                name: '物理',
                id: 16
            },
            {
                name: '化学',
                id: 18
            },
            {
                name: '道法',
                id: 20
            },
            {
                name: '历史',
                id: 21
            }
        ],
        record_list: [],
        imgList: {
            14: '/images/subject/Chinese.png',
            15: '/images/subject/match.png',
            16: '/images/subject/physics.png',
            17: '/images/subject/English.png',
            18: '/images/subject/chemistry.png',
            19: '/images/subject/biology.png',
            20: '/images/subject/moralityandlaw.png',
            21: '/images/subject/history.png',
            22: '/images/subject/geography.png'
        },
        showModel: false, //提示弹框
        showPsd: false, //让家长输入密码的弹框
        errorCode: false, //二维码扫描错误的弹框
        hideTableBar: false,
        showTitle: false,
        Length: 4,
        pwdVal: '',
        psdFocus: true,
        isAnimate: false,
        bannerList: [
            //   {
            //   index: 0,
            //   url: 'http://znwy.oss-cn-beijing.aliyuncs.com/zyzs/images/mine0.jpg',
            // },
            {
                index: 1,
                url: 'http://znwy.oss-cn-beijing.aliyuncs.com/zyzs/images/shucheng.jpg',
            },
            {
                index: 2,
                url: 'http://znwy.oss-cn-beijing.aliyuncs.com/zyzs/images/oneonone1.png',
            }
        ],
        circleFlag: false,
        currentPage: 1,
        hasMoreData: true, //判断是否需要请求下一页的数据
    },
    getData(e) {
        let data = e.detail;
        this.setData({
            industryOneId: data.industryOneId,
            industryTwoId: data.industryTwoId
        })
        if (data.industryOneId == 10) {
            this.getScanList(1, '', '')
        } else {
            let stageindex = data.industryOneId;
            let objectIndex = data.industryTwoId;
            this.getScanList(1, stageindex, objectIndex)
        }
    },
    //获取数据
    getScanList(page, stageindex, objectIndex) {
        //图标组件在返回按钮的情况下，进行重新的绘图并且渲染。
        this.setData({
            circleFlag: false,
        })
        let url = wx.getStorageSync('requstURL') + 'homework/list';
        let token = wx.getStorageSync('token');
        let data = {
            token: token,
            pagesize: 10,
            page: page
        };
        stageindex !== "" ? data.stage_id = parseInt(stageindex) : '';
        objectIndex !== "" ? data.subject_id = objectIndex : '';
        // console.log(data)
        ajax.requestLoad(url, data, 'GET').then(res => {
            if (res.code === 20000) {
                if (res.total_count < 1 && stageindex == '' & objectIndex == '') {
                    this.setData({
                        showScan: true //表示页面没有数据
                    })
                } else {
                    res.record_list.forEach((item, index) => {
                        item.precent = ((item.question_count - item.wrong_question_count) * 100 / item.question_count).toFixed(0);
                    })
                    var contentlistTem = this.data.record_list;
                    if (page == 1) {
                        contentlistTem = []
                    }
                    var contentlist = res.record_list;

                    if (res.total_page == res.page) { //表示到最后一页了
                        contentlist = contentlistTem.concat(contentlist),
                            this.setData({
                                showScan: false,
                                record_list: contentlist,
                                circleFlag: true,
                                hasMoreData: false
                            })
                    } else {
                        contentlist = contentlistTem.concat(contentlist),
                            this.setData({
                                showScan: false,
                                record_list: contentlist,
                                circleFlag: true,
                                hasMoreData: true,
                                currentPage: page + 1
                            })
                    }
                    // console.log(this.data.record_list)
                }
            }
        })
    },
    scanHandleResult(section_id) {
        let url = wx.getStorageSync('requstURL') + 'homework/info';
        let token = wx.getStorageSync('token');
        if (token && token != '') {
            let data = {
                token: token,
                section_id: section_id
            };
            ajax.requestLoad(url, data, 'GET').then(res => {
                if (res.code === 20000) {
                    if (!res.isBind) {
                        wx.showModal({
                            title: "提示",
                            content: `“${res.section.name}”未入库，请联系管理员`,
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
        }
    },
    // 有两种处理结果，一种是result，一种是path，这两种情况都可以拿到section_id
    scancode: function () {
        let that = this;
        const {
            loginFlag
        } = this.data;
        if (loginFlag) {
            // 允许从相机和相册扫码
            wx.scanCode({
                // scanType:['datamatrix', 'qrCode'],
                success(res) {
                    console.log(res);
                    if (res.result) {
                        let result = res.result;
                        if (result) {
                            let section_id = res.result.split(',')[0];
                            if (result.indexOf('https://172.17.250.193') > -1) { //正式验证
                                // if (result.indexOf('http://fdtest.canpoint.net') > -1) { //测试验证
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
                    }else{
                        wx.hideTabBar({
                            success: function () {
                                wx.hideLoading();
                                that.setData({
                                    errorCode: true,
                                })
                            }
                        })
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
    goList(e) {
        const {
            sectionid,
            sectiontime,
            imglist,
            stagestatus
        } = e.currentTarget.dataset;
        wx.setStorageSync('imglist', imglist);

        if (stagestatus == 1) {
            wx.navigateTo({
                url: `/pages/markWrongList/markWrongList?section_id=${sectionid}`,
            })
        } else {
            wx.navigateTo({
                url: `/pages/workReport/workReport?section_id=${sectionid}&section_time=${sectiontime}`,
            })
        }
    },
    //查看原图 
    checkRestImg(e) {
        const {
            imglist
        } = e.currentTarget.dataset;
        // console.log(imglist.length)
        wx.setStorageSync('imglist', imglist);
        wx.navigateTo({
            url: `/pages/restImg/checkRestImg`,
        })
    },
    linkout() {
        this.setData({
            showModel: false,
            showTitle: true
        })
    },
    sureopen() {
        this.setData({
            showModel: false,
            showPsd: true
        })
    },
    backout() {
        wx.setStorageSync('first_login', 0)
        this.setData({
            showPsd: false,
            showTitle: true
        })
    },
    surepsd() {
        let {
            pwdVal
        } = this.data;
        var that = this;
        if (pwdVal.length === 4) {
            let url = wx.getStorageSync('requstURL') + 'user/monitor/password/setting';
            let token = wx.getStorageSync('token');
            let data = {
                token: token,
                monitor_password: pwdVal
            }
            ajax.requestLoad(url, data, 'POST').then(res => {
                if (res.code === 20000) {
                    wx.showToast({
                        title: '请您牢记您的密码哦~',
                        icon: 'none',
                        duration: 1000,
                        success: () => {
                            that.setData({
                                showPsd: false,
                                showModel: false
                            })
                            wx.showTabBar({
                                pwdVal: ''
                            })
                        }
                    })

                } else {
                    this.setData({})
                }
            })
        } else {
            wx.showToast({
                title: '请设置4为数字监管密码',
                icon: 'none',
                duration: 1000
            })
        }
    },
    yes() {
        wx.setStorageSync('first_login', 0)
        this.setData({
            showTitle: false,
        })
        wx.showTabBar({})
    },
    closeError() {
        this.setData({
            errorCode: false,
        })
        wx.showTabBar({})
    },
    getFocus: function () {
        this.setData({
            psdFocus: true
        });
    },
    inputPwd: function (e) {
        this.setData({
            pwdVal: e.detail.value
        });
    },
    gologin() {
        wx.reLaunch({
            url: '/pages/login/login',
        })
    },
    goExplain(e) {
        const {
            index
        } = e.currentTarget.dataset;
        if (index == 1) {
            wx.navigateToMiniProgram({
                appId: 'wxa434b2c20ea3ddeb',
                path: '',
                success(res) {
                    // 打开成功
                }
            })
        }
        if (index == 2) {
            wx.navigateTo({
                url: `/pages/mine/studentHelp?form=scan`,
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    gup(name, url) {
        if (!url) url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return results == null ? null : results[1];
    },
    onLoad: function (options) {
        // this.notice()
        // console.log(query)
        // console.log(typeof query.scene)
        let id = '';
        let section_id_op = '';
        if (options.q) {
            let queryAll = decodeURIComponent(options.q);
            id = this.gup('scene', queryAll);
            section_id_op = id.split(',')[0];
        }
        let token = wx.getStorageSync('token');
        let monitor_moudle = wx.getStorageSync('monitor_moudle');
        let monitor_moudlePass = wx.getStorageSync('monitor_moudlePass');
        let startTime = wx.getStorageSync('startTime');
        //上次登录的时间与这次登录的时间相减，得到两次登录之间隔了多少毫秒
        let nowTimeDot = new Date().getTime() - startTime;
        //24小时过期时间的毫秒戳
        let lateTime = 1000 * 60 * 60 * 24 * 7;
        // console.log(token)
        if (token && token != '') {
            this.setData({
                loginFlag: true
            })
            if (nowTimeDot > lateTime) {
                //大于了7 * 24小时
                wx.reLaunch({
                    url: '/pages/login/login',
                })
            } else {
                //开通了家长监管模式，且曾经没有输入家长监管模式密码的
                if (monitor_moudle == 1 && monitor_moudlePass == 0) {
                    wx.reLaunch({
                        url: '/pages/login/login',
                    })
                } else {
                    //没有考虑token过期等的情况
                    this.loginSuccessShow();
                    //各种情况下都可以登录，且url上面自带了section_id,则需要根据情况进行处理 scanHandleResult(section_id);
                    if (id != "") {
                        this.scanHandleResult(section_id_op);
                    }
                    //第一次进入项目,进入页面提示家长开启监管模式
                    let first_login = wx.getStorageSync('first_login')
                    if (first_login == 1) {
                        this.setData({
                            showModel: true,
                        })
                        wx.hideTabBar({})
                    }
                }
            }
        } else {
            this.setData({
                loginFlag: false,
                showScan: true,
            })
        }
    },
    // getnotice() {
    //   let showTips = wx.getStorageSync('showTips');
    //   let url = wx.getStorageSync('requstURL') + 'common/latest/notice';
    //   ajax.requestLoad(url, {}, 'GET').then(res => {
    //     if (res.code === 20000) {
    //       if (showTips == 0&&res.data.status==1) {
    //         wx.showModal({
    //           title: '公告',
    //           content: res.data.text,
    //           showCancel: false,
    //           success(res) {
    //             if (res.confirm) {
    //               wx.setStorageSync('showTips', 1)
    //             }
    //           }
    //         }) 
    //       }
    //     }
    //   })
    // },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    notice() {
        let showTips = wx.getStorageSync('showTips');
        if (showTips == 0) {
            wx.showModal({
                title: '公告',
                content: '小助手将于2020年11月26日11:00至15:00进行系统升级(具体恢复时间以实际时间为准)，在此期间系统功能将无法使用，如此给您带来的不便，敬请谅解！',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        wx.setStorageSync('showTips', 1)
                    }
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let token = wx.getStorageSync('token');
        console.log(token == '')
        if (token == '') {
            this.setData({
                loginFlag: false,
                showScan: true,
            })
        }
    },
    //第一次进入项目的且免登录，或者已经登录过后，需要做的事情
    loginSuccessShow() {
        let {
            industryOneId,
            industryTwoId
        } = this.data;
        if (!industryOneId) {
            this.getScanList(1, '', '')
        } else {
            if (industryOneId == 10) {
                this.getScanList(1, '', '')
            } else {
                let stageindex = industryOneId;
                let objectIndex = industryTwoId;
                this.getScanList(1, stageindex, objectIndex)
            }
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
        this.loginSuccessShow();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        const {
            hasMoreData,
            industryOneId,
            industryTwoId,
            currentPage
        } = this.data;
        if (!hasMoreData) {
            return;
        } else {
            if (!industryOneId) {
                this.getScanList(currentPage, '', '')
            } else {
                if (industryOneId == 10) {
                    this.getScanList(currentPage, '', '')
                } else {
                    let stageindex = industryOneId;
                    let objectIndex = industryTwoId;
                    this.getScanList(currentPage, stageindex, objectIndex)
                }
            }
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
// pages/markWrongList/playVideo.js
var ajax = require("./../../utils/ajax.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        vimg: "",
        vsrc: "",
        adVurl: "",
        videoList: [],
        section_id: "",
        qid: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {
            type,
            section_id
        } = options;
        let vOptions = wx.getStorageSync('vOptions');
        this.setData({
            vimg: vOptions.vimg,
            vsrc: vOptions.vsrc,
            type: type,
            section_id: section_id,
            qid: vOptions.vqid,
        })
        if (type == 2) {
            let url = wx.getStorageSync('requstURL') + 'homework/section/video/list';
            let token = wx.getStorageSync('token');
            let data = {
                token: token,
                section_id: section_id,
            };
            ajax.requestLoad(url, data, 'GET').then(res => {
                this.setData({
                    videoList: res.video_list
                })
            })
        }
    },
    sendPlay() {
        let {
            section_id,
            qid
        } = this.data;
        let url = wx.getStorageSync('requstURL') + 'homework/question/video/play';
        let token = wx.getStorageSync('token');
        let data = {
            token: token,
            section_id: section_id,
            qid: qid
        };
        let header = {
            "Content-type": "application/x-www-form-urlencoded"
        }
        wx.request({
            url: url,
            data: data,
            method: 'POST',
            header: header,
            success: function (res) {},
            fail: function (error) {}
        })
    },
    sendPlay2(e) {
        let {
            section_id
        } = this.data;
        let {
            vqid
        } = e.currentTarget.dataset;
        let url = wx.getStorageSync('requstURL') + 'homework/question/video/play';
        let token = wx.getStorageSync('token');
        let data = {
            token: token,
            section_id: section_id,
            qid: vqid
        };
        let header = {
            "Content-type": "application/x-www-form-urlencoded"
        }
        wx.request({
            url: url,
            data: data,
            method: 'POST',
            header: header,
            success: function (res) {},
            fail: function (error) {}
        })
    },
    // playbtn() {
    //     //直接全屏播放视频
    //     var videoContext = wx.createVideoContext('myvideo', this);
    //     videoContext.requestFullScreen();
    // },
    // startVideo() {
    //     var videoContext = wx.createVideoContext('myvideo', this);
    //     videoContext.requestFullScreen();
    // },
    // closeVideo() {
    //     //执行退出全屏方法
    //     var videoContext = wx.createVideoContext('myvideo', this);
    //     videoContext.exitFullScreen();
    // },
    getClass() {
        wx.navigateTo({
            url: '/pages/mine/studentHelp?form=advert',
        })
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
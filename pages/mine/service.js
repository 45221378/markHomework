// pages/mine/service.js
import Json from "../../utils/serveceJson";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        answer: [],
        serviceJson: [],
        checkedId: ''
    },
    shouAnswer(e) {
        const { id } = e.currentTarget.dataset;
        const { serviceJson } = this.data;
        serviceJson.forEach(item => {
            if (item.id == id) {
                // let answerInt = this.data.answer;
                // answerInt = answerInt.concat(item)
                // console.log(answerInt)
                // console.log(item)
                let answerInt = [];
                answerInt.push(item)
                this.setData({
                    answer: answerInt,
                    checkedId: id
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            serviceJson: Json.serviceJson
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

    }
})
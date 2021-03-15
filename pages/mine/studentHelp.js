Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: ''
    }, 

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.form == 'scan1') {
            this.setData({
                src: "https://www.quanpinzaixian.com/#/oneonone_3"
            })
        } else if (options.form == 'mine2') {
            this.setData({
                src: "https://www.quanpinzaixian.com/#/oneonone_2"
            })
        }else if (options.form == 'mine3') {
            this.setData({
                src: "https://mp.weixin.qq.com/s/PVDIUXUangwTopDUdeKlAA"
            })
        } else if (options.form == 'advert') {
            this.setData({
                src: "https://www.quanpinzaixian.com/#/oneonone"
            })
        } else if(options.form == 'mineicon'){
            this.setData({
                src:"https://mp.weixin.qq.com/s/-6VmVi-5yFjBUTqr4AYOYg"
            })
        }else if (options.form == 'openLis1') {
            this.setData({
                src: "https://mp.weixin.qq.com/s/6b1snGPebsEMc7Bq_U0uiA"
            })
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
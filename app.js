//app.js 
// 发布版本前，app.js,scanWork.js,errorList.js 都需要进行环境的改变
//关于 git 分支的情况
// devtest 是写死的循环层数数据嵌套，暂时可以用，目前在用。但是如果页面的层级数更高的话，页面就会出现问题。
// dev     是递归的模板循环嵌套，已经开发完成，待提测
// dev1.0  为第二版本数据，9-7以前的线上版本，到时候做更新公告的时候会用到。
// dev3.0  为第三版本数据，12-4以前的线上版本。
// dev4.0  为第四版本数据，12-4以后的线上版本。
App({
    onLaunch: function() {
        // wx.setStorageSync('requstURL', 'http://192.168.1.238:8000/v2/')  //测试环境
        // wx.setStorageSync('requstURL', 'https://zycs.canpoint.net/v2/') //测试环境
        wx.setStorageSync('requstURL', 'https://zyzs.canpoint.net/v2/') //正式环境，扫一扫的扫描判断也要改
        wx.setStorageSync('showTips', 0) //进入小程序的时候存储0，弹过弹框提示后，变为1，保证其他的页面不弹
    },
    onShow() {
        // setTimeout(()=>{
        //     wx.setStorageSync('faa', true)
        // },10000)
    },
    onHide: function() {
        wx.setStorageSync('showTips', 0)
    },
    globalData: {
        userInfo: null,
    }
})
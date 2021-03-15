//app.js 
// 发布版本前，app.js,scanWork.js,errorList.js 都需要进行环境的改变
//关于 git 分支的情况
// devtest 是写死的循环层数数据嵌套，暂时可以用，目前在用。但是如果页面的层级数更高的话，页面就会出现问题。
// dev     是递归的模板循环嵌套，最新版本， 2021年1月22日提测。
// dev1.0  为第二版本数据，9-7以前的线上版本，到时候做更新公告的时候会用到。
// dev3.0  为第三版本数据，12-4以前的线上版本。
// dev4.0  为第四版本数据，12-4以后的线上版本。
// psdSeer  为重写监管密码那块的逻辑。
App({
    onLaunch: function() {
        wx.setStorageSync('requstURL', 'https://zscs.canpoint.net/v2/') //测试环境
        // wx.setStorageSync('requstURL', 'https://zyzs.canpoint.net/v2/') //正式环境，扫一扫的扫描判断也要改
        wx.setStorageSync('showAdvert', 'open') //进入小程序的时候存储open，弹过弹框提示后，变为close
        wx.setStorageSync('version', 0) //0表示测试环境，1表示正式环境
    },
    onShow() {
    },
    onHide: function() {

    },
    globalData: {
        userInfo: null,    }
})
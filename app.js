const app = getApp()
App({
    globalData: {
        RequestUrl: 'https://newdreamer.cn:8080/',
        userInfo: null
    },

    onLaunch: function() {
		return
        var that = this
        wx.login({
            success: function(res) {
                wx.request({
                    url: that.globalData.RequestUrl + '',
                    method: "POST",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        code: res.code
                    },
                    success: function(res) {
                        console.log(res)
                    },
                    fail: function(e) {
                        console.log(e.errMsg)
                    },
                    complete: function() {
                        console.log(res.code)
                    }
                })
            }
        })
    },

})
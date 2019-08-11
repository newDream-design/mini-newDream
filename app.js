App({
    config: {
        RequestUrl: 'https://newdreamer.cn:8080/api/'
    },
    globalData: {
        memberID: ""
    },
    onLaunch: function() {
        var that = this
        wx.login({
            success: function(res) {
                wx.request({
                    url: that.config.RequestUrl + 'login?',
                    method: "GET",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        sc_code: res.code
                    },
                    success: function(res) {
                        that.globalData.memberID = res.data
                    },
                    fail: function(e) {
                        console.log(e.errMsg)
                    }
                })
            }
        })
    }
})
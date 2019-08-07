const app = getApp()
Page({
    data: {
        index: {}
    },

    onLoad: function(options) {
        this.request()
    },

    onPullDownRefresh() {
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.request()
    },

    request: function() {
        var that = this
        wx.request({
            url: app.globalData.RequestUrl + 'api',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                //OpenID: app.globalData.OpenID
            },
            success: function(res) {
                that.setData({
                    index: res.data
                })
            },
            fail: function(e) {
                wx.showToast({
                    title: e.errMsg,
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: function(e) {
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
            }
        })
    }
})
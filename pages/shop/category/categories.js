const app = getApp();
Page({
    data: {
        categories: [],
        currentCategory: 0,
    },
    onLoad: function(options) {
        if (options.currentCategory != undefined) this.data.currentCategory = options.currentCategory
    },
    onShow: function() {
        this.request()
    },
    request: function() {
        var that = this
        wx.request({
			url: app.config.RequestUrl + 'fenlei',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                //OpenID: app.globalData.OpenID
            },
            success: function(res) {
                that.setData({
                    categories: res.data
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
    },
    tapCategory: function(e) {
        this.setData({
            currentCategory: e.currentTarget.dataset.index
        })
    },
    //点击搜索
    search: function(e) {
        var searchmsg = e.detail.value.searchmsg;
        if (searchmsg == "") {
            wx.showToast({
                title: '请输入搜索的商品名',
                icon: 'none'
            })
        } else {

        }
    }
})
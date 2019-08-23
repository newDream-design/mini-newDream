const app = getApp()
Page({
    data: {
        index: {}
    },

    onShow: function(options) {
        this.request()
    },

    request: function() {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'shouye/get',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                //OpenID: app.globalData.OpenID
            },
            success: function(res) {
                var index = res.data.data.object
                index["icon"] = [{
                    "image": "/images/example.png",
                    "linkUrl": "客服"
                }, {
                    "image": "/images/example.png",
                    "linkUrl": "/pages/shop/product/product?productID=ND1M621T"
                }]
                index["classify"] = [{
                    "id": 0,
                    "text": "西服"
                }, {
                    "id": 1,
                    "text": "衬衫"
                }, {
                    "id": 2,
                    "text": "裤子"
                }, {
                    "id": 4,
                    "text": "配饰"
                }]
                that.setData({
                    index: index
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
    fixedIconTap: function(e) {
        var url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url,
        })
    },
    bindClassifyIconTap: function(e) {
        var currentCategory = e.currentTarget.dataset.id
        wx.setStorage({
            key: "currentCategory",
            data: currentCategory,
            success: function() {
                wx.switchTab({
                    url: '/pages/shop/category/classify',
                })
            }
        })
    }
})
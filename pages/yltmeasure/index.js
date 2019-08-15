Page({
    data: {
        measure: {
            "defaultMeasureDataID": 10001,
            "measureData": [{
                "MeasureDataID": 10001,
                "measureName": "熊伟",
                "details": {
                    "身高": "150CM",
                    "体重": "1KG",
                    "胸围": "1CM",
                    "腰围": "100CM",
                    "臀围": "1CM"
                }
            }]
        }
    },
    onLoad: function(options) {

    },
    //获取商品
    getMeasureData: function(productID) {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'liangti/get',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID: app.globalData.memberID
            },
            success: function(res) {
                if (res.data.result.status == 200) {
                    that.setData({
                        measureData: res.data.data.object
                    })
                } else {
                    wx.showToast({
                        title: res.data.result.errMsg,
                        icon: 'none',
                        duration: 2000
                    })
                }
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
})
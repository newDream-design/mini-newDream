const app = getApp()
Page({
    data: {
        measure: {
            "defaultMeasureDataID": 0,
            "measureData": []
        }
    },
    onShow: function(options) {
		this.getMeasureData()
    },
    getMeasureData: function() {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'chicun/get',
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
                        ["measure.measureData"]: res.data.data.object
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
            }
        })
    },
	bindChangeDefaultMeasureData: function(e) {
        var id = e.currentTarget.dataset.id
        this.setData({
            "measure.defaultMeasureDataID": id
        })
		wx.showToast({
			title: '暂时不需要默认尺寸，你就随便点点吧',
			icon:"none"
		})
    }
})
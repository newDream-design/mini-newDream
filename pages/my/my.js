const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: [],
        orderCount: {
            "toPay": 0,
            "toDeliver": 0,
            "toReceive": 0,
            "toComment": 0,
            "toRefund": 0
        },
        AddressAccess: true
    },
    onShow: function() {
        this.checkAddressAccess()
        this.getOrderCount()
    },
    getOrderCount: function() {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'dingdan/count/get',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID: app.globalData.memberID
            },
            success: function(res) {
                that.setData({
                    orderCount: res.data.data.object
                })
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
    checkAddressAccess: function() {
        var that = this
        wx.getSetting({
            success(res) {
                var AddressAccess = res.authSetting['scope.address'] == undefined ? true : res.authSetting['scope.address']
                that.setData({
                    AddressAccess: AddressAccess
                })
            }
        })
    },
    chooseAddress: function(e) {
        var that = this
        wx.chooseAddress({
            fail() {
                if (e.errMsg == "chooseAddress:fail auth deny") {
                    that.setData({
                        AddressAccess: false
                    })
                }
            }
        })
    },
})
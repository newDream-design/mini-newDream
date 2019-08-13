const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: [],
        count: {
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
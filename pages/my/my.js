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
        }
    },
    onShow: function() {

    },
    login: function(e) {

    },
    address: function(e) {
        wx.chooseAddress()
    },
})
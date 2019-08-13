const app = getApp();
Page({
    data: {
        products: [],
        address: {
            "userName": "请选择地址",
            "provinceName": "选择地址后才可以进行结算"
        },
        addressMsg: {},
        productsmsg: {}, //购物车结算产品信息
        summary: {
            allCount: 0,
            allPrice: 0,
            deliverPrice: 0,
            price: 0
        },
        remark: "",
        AddressAccess: true
    },
    onLoad: function(options) {
        this.setData({
            products: JSON.parse(options.products),
        })
        this.summary()
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
    summary: function() {
        var products = this.data.products
        var summary = this.data.summary
        for (var i in products) {
            summary.allCount += products[i]["count"]
            summary.allPrice += products[i]["count"] * products[i]["price"]
        }
        summary.price = summary.allPrice + summary.deliverPrice
        this.setData({
            summary: summary
        })
    },
    //修改订单留言
    onRemarkChange: function(e) {
        this.setData({
            remark: e.detail.value
        })
    },
    //跳转微信收货地址
    chooseAddress: function(e) {
        var that = this;
        wx.chooseAddress({
            success: function(res) {
                that.setData({
                    address: res
                })
            },
            fail(e) {
                if (e.errMsg == "chooseAddress:fail auth deny") {
                    that.setData({
                        AddressAccess: false
                    })
                }
            }
        })
    },
    //添加订单
    orderAdd: function() {
        var address = this.data.address;
        if (address.userName == "请选择地址") {
            wx.showToast({
                icon: 'none',
                title: '请选择地址！',
            })
            return;
        }
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'pay/get',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID: app.globalData.memberID,
                price: that.data.summary.price
            },
            success: function(res) {
                if (res.data.result.status == 200) {
                    var data = res.data.data.object
                    wx.requestPayment({
                        timeStamp: data.timeStamp,
                        nonceStr: data.nonceStr,
						package: data.package,
                        signType: 'MD5',
                        paySign: data.paySign,
                        success: function(res) {
                            console.log(res)
                        },
                        fail: function(e) {
                            console.log(e)
                        },
                        complete: function(res) {
                            console.log(res)
                        }
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
    }
})
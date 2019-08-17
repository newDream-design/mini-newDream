const app = getApp();
Page({
    data: {
        from: "unknown",
        products: [],
        selectedProducts: [],
        cart: [],
        address: {
            "userName": "请选择地址",
            "provinceName": "选择地址后才可以进行结算"
        },
        summary: {
            allCount: 0, //总件数
            allPrice: 0, //商品总价
            deliverPrice: 0, //运费
            price: 0 //用户需要支付的价格
        },
        remark: "",
        AddressAccess: true
    },
    onLoad: function(options) {
        this.setData({
            products: JSON.parse(options.products),
            from: options.from,
        })
        if (options.from == "cart") {
            this.setData({
                selectedProducts: JSON.parse(options.selectedProducts),
                cart: JSON.parse(options.cart)
            })
        }
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
            products[i]["price"] = parseFloat(products[i]["price"]).toFixed(2)
            products[i]["measureID"] = 10001
            products[i]["color"] = "黑色"
            summary.allCount += products[i]["count"]
            summary.allPrice += products[i]["count"] * products[i]["price"]
        }
        summary.price = summary.allPrice + summary.deliverPrice
        for (var p in summary) {
            if (p != "allCount") summary[p] = summary[p].toFixed(2)
        }
        this.setData({
            products: products,
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
        wx.showLoading({
            title: '支付请求中',
            mask: true
        })
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'pay/get',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID: app.globalData.memberID,
                price: that.data.summary.price * 100,
                order: {
                    products: that.data.products,
                    address: that.data.address,
                    summary: that.data.summary,
                    remark: that.data.remark
                }
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
                            wx.redirectTo({
                                url: '/pages/order/allOrders?currentTab=待发货',
                            })
                        },
                        fail: function(e) {
                            wx.redirectTo({
                                url: '/pages/order/allOrders?currentTab=待支付',
                            })
                        },
                        complete: function(res) {
                            if (that.data.from == "cart") {
                                var cart = that.data.cart
                                var selectedProducts = that.data.selectedProducts
                                for (var i in cart) {
                                    i = parseInt(i)
                                    if (selectedProducts.indexOf(i) != -1) {
                                        cart.splice(i, 1, -1)
                                    }
                                }
                                cart = cart.filter(function(val) {
                                    return val != -1
                                })
                                wx.request({
                                    url: app.config.RequestUrl + 'gouwuche/update',
                                    method: "GET",
                                    header: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    data: {
                                        memberID: app.globalData.memberID,
                                        cart: JSON.stringify(cart)
                                    },
                                    success: function(res) {
                                        if (res.data.result.status != 200) {
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
                            }
                        }
                    })
                } else {
					wx.hideLoading()
                    wx.showToast({
                        title: res.data.result.errMsg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: function(e) {
				wx.hideLoading()
                wx.showToast({
                    title: e.errMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    }
})
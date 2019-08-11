const app = getApp();
Page({
    data: {
        products: [],
        address: {
            "userName": "请选择地址"
        }, //地址的全部信息
        addressMsg: {}, //地址信息
        productsmsg: {}, //购物车结算产品信息
        summary: {
            allCount: 0,
            allPrice: 0,
            deliverPrice: 0,
            price: 0
        },
        remark: "",
    },
    onLoad: function(options) {
        this.setData({
            products: JSON.parse(options.products),
        })
        this.summary()
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
                console.log(res);
                that.setData({
                    address: res
                })
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
    }
})
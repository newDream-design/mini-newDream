const app = getApp();
Page({
    data: {
        selectedProducts: [],
        cart: [], //购物车信息
        total: 0.00, //价格总计
    },
    onShow: function() {
        this.getCart();
    },
    //获取购物车信息
    getCart: function() {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'gouwuche/get',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID: app.globalData.memberID
            },
            success: function(res) {
                if (res.data.result.status == 200) {
                    var cart = JSON.parse(res.data.data.object)
                    for (var i in cart) {
                        cart[i]["price"] = parseFloat(cart[i]["price"]).toFixed(2)
                    }
                    that.setData({
                        cart: cart
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
    //更新购物车信息
    updateCart: function() {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'gouwuche/update',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID: app.globalData.memberID,
                cart: JSON.stringify(that.data.cart)
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
            },
            complete: function(e) {
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
            }
        })
    },
    // 数量加减
    onProductCountChange: function(e) {
        var delta = parseInt(e.currentTarget.dataset.delta);
        var index = e.currentTarget.dataset.index;
        var cart = this.data.cart
        var count = parseInt(cart[index]["count"])
        if (count <= 1 && delta < 0) {
            wx.showToast({
                title: "数量已到达下限",
                icon: 'none',
                duration: 3000
            })
        } else if (count >= 99 && delta > 0) {
            wx.showToast({
                title: "数量已到达上限",
                icon: 'none',
                duration: 3000
            })
        } else {
            cart[index]["count"] = count + delta
        }
        this.setData({
            cart: cart
        })
        this.sum()
        this.updateCart()
    },
    deleteCart: function(e) {
        var that = this
        wx.showModal({
            title: '提示',
            content: '是否确定删除',
            success(res) {
                if (res.confirm) {
                    var index = e.currentTarget.dataset.index;
                    var cart = that.data.cart
                    cart.splice(index, 1)
                    var selectedProducts = that.data.selectedProducts
                    for (var i in selectedProducts) {
                        var sp = selectedProducts[i]
                        if (sp == index) {
                            selectedProducts.splice(i, 1, -1)
                        } else if (sp > index) {
                            selectedProducts.splice(i, 1, sp - 1)
                        }
                    }
                    selectedProducts = selectedProducts.filter(function(val) {
                        return val != -1
                    })
                    that.setData({
                        selectedProducts: selectedProducts,
                        cart: cart
                    })
                    that.sum()
                    that.updateCart()
                }
            }
        })
    },
    /**
     * 单个选择
     */
    onProductSelected: function(e) {
        var index = e.currentTarget.dataset.index; //序号
        var selectedProducts = this.data.selectedProducts
        var loc = selectedProducts.indexOf(index)
        if (loc == -1) {
            selectedProducts.push(index)
            selectedProducts.sort()
        } else {
            selectedProducts.splice(loc, 1)
        }
        this.setData({
            selectedProducts: selectedProducts
        })
        this.sum()
    },
    /**
     * 全选
     */
    onAllSelected: function(e) {
        var arr = []
        if (this.data.selectedProducts.length < this.data.cart.length) {
            for (var i = 0; i < this.data.cart.length; i++) arr.push(i)
        }
        this.setData({
            selectedProducts: arr
        })
        this.sum()
    },
    /**
     * 统计
     */
    sum: function(e) {
        var cart = this.data.cart;
        var selectedProducts = this.data.selectedProducts
        var total = 0;
        for (var i in selectedProducts) {
            if (cart[i] == undefined) continue
            i = selectedProducts[i]
            total += cart[i]["count"] * cart[i]["price"];
        }
        this.setData({
            total: total.toFixed(2)
        })
    },
    //结算，判断选中并跳转
    bindBalance: function() {
        var selectedProducts = this.data.selectedProducts
        var cart = this.data.cart;
        var products = [];
        for (var i in selectedProducts) {
            products.push(cart[selectedProducts[i]]);
        }
        if (products.length <= 0) {
            wx.showToast({
                title: '未选择结算产品！',
                icon: "none"
            });
            return;
        }
        wx.navigateTo({
            url: '/pages/order/operation/confirmOrder?products=' + JSON.stringify(products)
        })
    }
});
const app = getApp();
Page({
    data: {
        selectedProducts: [],
        carts: [{
                "productID": 102,
                "productName": "我是11条小青龙",
                "image": "/images/test/d2.jpg",
                "price": 1099.99,
                "count": 10
            },
            {
                "productID": 101,
                "productName": "我是12条小青龙",
                "image": "/images/test/d2.jpg",
                "price": 1099.99,
                "count": 10
            }, {
                "productID": 103,
                "productName": "我是13条小青龙",
                "image": "/images/test/d2.jpg",
                "price": 1099.99,
                "count": 10
            }
        ], //购物车信息
        total: 0.00, //价格总计
    },
    onShow: function() {
        this.request();
    },
    /**
     * 获取购物车信息
     */
    request: function() {
        //获取购物车信息
        var that = this;
    },
    updateCarts: function() {
        //更新购物车信息
        var that = this;
    },
    // 数量加减
    onProductCountChange: function(e) {
        var delta = parseInt(e.currentTarget.dataset.delta);
        var index = e.currentTarget.dataset.index;
        var carts = this.data.carts
        var count = parseInt(carts[index]["count"])
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
            carts[index]["count"] = count + delta
        }
        this.setData({
            carts: carts
        })
        this.sum()
        this.updateCarts()
    },
    delCart: function(e) {
        var that = this
        wx.showModal({
            title: '提示',
            content: '是否确定删除',
            success(res) {
                if (res.confirm) {
                    var index = e.currentTarget.dataset.index;
                    var carts = that.data.carts
                    carts.splice(index, 1)
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
                        carts: carts
                    })
                    that.sum()
                    that.updateCarts()
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
        if (this.data.selectedProducts.length < this.data.carts.length) {
            for (var i = 0; i < this.data.carts.length; i++) arr.push(i)
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
        var carts = this.data.carts;
        var selectedProducts = this.data.selectedProducts
        var total = 0;
        for (var i in selectedProducts) {
            if (carts[i] == undefined) continue
            i = selectedProducts[i]
            total += carts[i]["count"] * carts[i]["price"];
        }
        this.setData({
            total: total.toFixed(2)
        })
    },
    //结算，判断选中并跳转
    bindBalance: function() {
        var selectedProducts = this.data.selectedProducts
        var carts = this.data.carts;
        var products = [];
        for (var i in selectedProducts) {
            products.push(carts[i]);
        }
        if (products.length <= 0) {
            wx.showToast({
                title: '未选择结算产品！',
                icon: "none"
            });
            return;
        }
        wx.navigateTo({
            url: 'confirmOrder?products=' + JSON.stringify(products)
        })
    }
});
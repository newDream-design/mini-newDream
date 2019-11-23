//获取应用实例
const app = getApp()
Page({
    data: {
        tabID: 0,
        cart: [], //购物车
        products: {},
        measureData: {},
        price: {
            "min": 0,
            "max": 0
        },
        mainProduct: 0,
        selectProduct: 0,
        selectSize: -1,
		selectSizeName: "无尺寸",
        currentImage: 1,
        count: 1,
        showSpec: 0,
        specText: '点击开始定制',
        //默认属性
        comments: [], //评论
        isFixedTap: false,
        isAdding: false,
		sales:"无"
    },
    onLoad: function(options) {
        this.getProduct(options.productID)
        this.getProductComment(options.productID)
    },
    onShow: function() {
        this.getCart()
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
                        ["measureData"]: res.data.data.object
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
    onHide: function() {
        this.setData({
            showSpec: 0,
        });
    },
    bindSwiper: function(e) {
        this.setData({
            currentImage: e.detail.current + 1
        })
    },
    navTap: function(e) {
        this.setData({
            tabID: e.currentTarget.dataset.tab
        });
    },
    //获取商品
    getProduct: function(productID) {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'shangpin/get',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID: app.globalData.memberID,
                productID: productID
            },
            success: function(res) {
                if (res.data.result.status == 200) {
                    var products = res.data.data.object.products
                    var mainProduct = 0
                    var price = {
                        "min": undefined,
                        "max": undefined
                    }
                    for (var i in products) {
                        if (productID == products[i]["productID"]) mainProduct = i
                        products[i]["image"] = products[i]["image"].split(" ")
                        products[i]["size"] = "160 165 170 175 180 185"
                        products[i]["size"] = products[i]["size"].split(" ")
                        if (price.min == undefined || products[i]["price"] < price.min) price.min = products[i]["price"]
                        if (price.max == undefined || products[i]["price"] > price.max) price.max = products[i]["price"]
                    }
                    that.setData({
						sales: res.data.data.object.sale_count,
                        mainProduct: mainProduct,
                        products: products,
                        price: price
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
    //获取商品评价
    getProductComment: function(productID_Main) {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'pinjia/get',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID: app.globalData.memberID,
                productID_Main: productID_Main
            },
            success: function(res) {
                if (res.data.result.status == 200) {
                    that.setData({
                        comments: res.data.data.object
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
                    var cart = res.data.data.object
                    cart = cart == "" ? [] : JSON.parse(cart)
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
    //点击收藏产品
    bindCollect: function(e) {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'shoucangjia/' + (that.data.products[that.data.mainProduct].isCollect ? "delete" : "add"),
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID: app.globalData.memberID,
                productID: that.data.products[that.data.mainProduct].productID
            },
            success: function(res) {
                if (res.data.result.status == 200) {
                    var products = that.data.products
                    products[that.data.mainProduct].isCollect = !products[that.data.mainProduct].isCollect
                    that.setData({
                        products: products
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
    //点击购物车
    bindCart: function() {
        wx.switchTab({
            url: '/pages/my/cart',
        })
    },
    //选择规格商品加减
    onProductCountChange: function(e) {
        var delta = parseInt(e.currentTarget.dataset.delta);
        var count = this.data.count
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
            count = count + delta
        }
        this.setData({
            count: count
        })
    },
    //点击遮罩层，选择规格隐藏
    distpickerCancel: function(e) {
        this.setData({
            showSpec: 0
        })
    },
    //选择子产品
    choseProduct: function(e) {
        this.setData({
            selectProduct: e.currentTarget.dataset.pid
        })
    },
    //选择尺寸
    choseSize: function(e) {
        this.setData({
            selectSize: e.currentTarget.dataset.did,
			selectSizeName: e.currentTarget.dataset.name
        })
    },
    //跳转
    addSize: function() {
        wx.switchTab({
            url: '/pages/yltmeasure/index',
        })
    },
    bindChooseSpec: function(e) {
        this.setData({
            showSpec: e.currentTarget.dataset.buynow
        })
    },
    //选择属性
    choseProperty: function(e) {
        var subpropertyid = e.currentTarget.dataset.subpropertyid; //产品属性id
        var propertyid = e.currentTarget.dataset.propertyid; //属性id
        var defaultproperty = ''; //显示选择的属性
        var productSpec = this.data.productDetails.productSpec;
        for (var index in productSpec) {
            var insproductSpec = [];
            var subproperty = productSpec[index].subproperty;
            for (var indexin in subproperty) {
                var subpropertyin = subproperty[indexin];
                if (propertyid == subpropertyin.propertyid) {
                    subpropertyin.ischosein = 0;
                }
                if (subpropertyid == subpropertyin.id) {
                    subpropertyin.ischosein = 1;
                }
                if (subpropertyin.ischosein == 1) {
                    defaultproperty += ' "' + subpropertyin.nametrue + '"';
                }
                insproductSpec.push(subpropertyin);
            }
            productSpec[index].subproperty = insproductSpec;
        }
        var productDetails = this.data.productDetails
        productDetails["productSpec"] = productSpec
        this.setData({
            defaultproperty: defaultproperty,
            productDetails: productDetails
        })
    },
    //添加到购物车
    submit: function() {
        if (this.data.isAdding) return
        if (this.data.selectProduct == -1) {
            wx.showToast({
                title: '请选择产品',
                icon: "none"
            })
            return
        }
        if (this.data.selectSize == -1 && this.data.products[this.data.selectProduct].mark == "定制") {
            wx.showToast({
                title: '请选择尺寸',
                icon: "none"
            })
            return
        }
        this.setData({
            isAdding: true
        })
        var cart = this.data.cart
        var product = {
            "productID": this.data.products[this.data.selectProduct].productID,
            "productID_Main": this.data.products[this.data.mainProduct].productID,
            "productName": this.data.products[this.data.selectProduct].productName,
            "image": this.data.products[this.data.selectProduct].image[0],
            "price": this.data.products[this.data.selectProduct].price,
            "count": this.data.count,
            "measureID": this.data.selectSize,
			"measureName": this.data.selectSizeName
        }

        /* 对象比较器 */
        function isObjectValueEqual(a, b, debug = false) {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            if (aProps.length != bProps.length) {
                if (debug) console.log("长度不符")
                return false;
            }
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                var propA = a[propName];
                var propB = b[propName];
                if (typeof propA === "object") {
                    if (!isObjectValueEqual(propA, propB, debug)) {
                        if (debug) console.log("对象不匹配：", propName, propA, propB)
                        return false;
                    }
                } else if (propName == "count" || propName == "price") {
                    continue
                } else if (propA !== propB) {
                    if (debug) console.log("对象不匹配：", propName, propA, propB)
                    return false;
                }
            }
            if (debug) console.log("对象匹配：", a, b)
            return true;
        }

        if (this.data.showSpec == 1) {
            var isInCart = false
            for (var i in cart) {
                if (isObjectValueEqual(product, cart[i], true)) {
                    cart[i]["price"] = product.price
                    cart[i]["count"] += product.count
                    isInCart = true
                    break
                }
            }
            if (!isInCart) cart.push(product)
            var that = this
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
                    if (res.data.result.status == 200) {
                        that.setData({
                            cart: cart,
                            showSpec: 0
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
                    that.setData({
                        isAdding: false
                    })
                }
            })
        } else if (this.data.showSpec == 2) {
            wx.navigateTo({
                url: '/pages/order/operation/confirmOrder?from=product&products=' + JSON.stringify([product])
            })
        }
    },


    onShareAppMessage: function(res) {
        return {
            //title: '自定义转发标题',
            //path: '/page/user?id=123',
            //imageUrl: ''
        }
    }
})
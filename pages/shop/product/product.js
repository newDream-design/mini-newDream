//获取应用实例
const app = getApp()
Page({
    data: {
        tabID: 0,
        cart: [], //购物车
        productDetails: {
            "images": [
                "/images/test/p.jpg", "/images/test/p1.jpg", "/images/test/p2.jpg"
            ],
            "productName": "纯黑全棉七彩白衬衫",
            "price": 100,
            "sale": 0,
            "posts": [
                "/images/test/d1.jpg", "/images/test/d2.jpg", "/images/test/d3.jpg", "/images/test/d4.jpg"
            ],
            "productSpec": [{
                "name": "123",
                "subproperty": [{
                    "propertyid": 1,
                    "nametrue": "类别1",
                    "ischosein": 1
                }, {
                    "propertyid": 2,
                    "nametrue": "类别2",
                    "ischosein": 0
                }, {
                    "propertyid": 3,
                    "nametrue": "类别3",
                    "ischosein": 0
                }]
            }],
            "isCollect": 0
        },
        //选择规格
        count: 1,
        showSpec: 0,
        specText: '点击选择量体数据',
        //默认属性
        comments: [{
            "userName": "王小明",
            "userAvatar": "",
            "createTime": "2019-01-01 12:00:00",
            "content": "这什么神仙西装，我好喜欢啊！"
        }, {
            "userName": "王小明",
            "userAvatar": "",
            "createTime": "2019-01-01 12:00:00",
            "content": "这什么神仙西装，我好喜欢啊！"
        }, {
            "userName": "王小明",
            "userAvatar": "",
            "createTime": "2019-01-01 12:00:00",
            "content": "这什么神仙西装，我好喜欢啊！"
        }], //评论
        isFixedTap: false,
    },
    onLoad: function(options) {
        this.getProduct(options.productID)
        this.getCart()
    },
    onHide: function() {
        this.setData({
            showSpec: 0,
        });
    },
    bindScrollListen: function(e) {
        let scrollTop = e.detail.scrollTop;
        if (scrollTop >= height) {
            this.setData({
                isFixedTap: true
            });
        } else {
            this.setData({
                isFixedTap: false
            });
        }
    },
    navTap: function(e) {
        this.setData({
            tabID: e.currentTarget.dataset.tab
        });
    },
    bindChooseSpec: function(e) {
        this.setData({
            showSpec: e.currentTarget.dataset.buynow
        })
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
                    var productDetails = res.data.data.object
                    that.setData({
                        productDetails: productDetails
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
                    that.setData({
                        cart: JSON.parse(res.data.data.object)
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
    //获取产品规格
    requestProductSpec: function(e) {},
    //点击收藏产品
    bindCollect: function(e) {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'shoucangjia/' + (this.data.productDetails.isCollect ? "delete" : "add"),
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID: app.globalData.memberID,
                productID: that.data.productDetails.productID
            },
            success: function(res) {
                if (res.data.result.status == 200) {
                    var productDetails = that.data.productDetails
                    productDetails.isCollect = !productDetails.isCollect
                    that.setData({
                        productDetails: productDetails
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
    //选择评论
    swichNav: function(e) {},
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
    addshopcart: function() {
        var cart = this.data.cart
        var product = {
            "productID": this.data.productDetails.productID,
            "productName": this.data.productDetails.productName,
            "image": this.data.productDetails.image[0],
            "price": this.data.productDetails.price,
            "count": this.data.count
        }
        cart.push(product)
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
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
            }
        })
    },
    //获取评论
    getComments: function() {},
    //点击评论类型
    etActive: function(e) {},




    onShareAppMessage() {
        try {
            let memberId = wx.getStorageSync('memberId');
            let productId = this.data.productId;
            console.log(memberId);
            if (memberId) {
                return {
                    title: '苏州美途电商平台',
                    path: '/pages/goodsDetails/goodsDetails?id=' + memberId,
                    path: '/pages/goodsDetails/goodsDetails?productId=' + productId + '?id=+ memberId',
                    imageUrl: '',
                    success: function(res) {
                        console.log(res.shareTickets[0]);
                    },
                }
            }
        } catch (e) {
            wx.showToast({
                title: '获取用户id失败',
                icon: 'none',
            })
            // Do something when catch error
        }

    }
})
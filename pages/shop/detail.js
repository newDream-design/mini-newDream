//获取应用实例
const app = getApp()
Page({
    data: {
        productId: 0, //产品id
        tabID: 0,
        cartCount: 5, //购物车商品数量
        productDetails: {
            "images": [
                "/images/test/p.jpg", "/images/test/p1.jpg", "/images/test/p2.jpg"
            ],
            "productname": "纯黑全棉七彩白衬衫",
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
            "price": 100,
            "sale": 0,
            "stock": 5,
            "posts": [
                "/images/test/d1.jpg", "/images/test/d2.jpg", "/images/test/d3.jpg", "/images/test/d4.jpg"
            ],
            "isCollect": 0
        }, //产品详情
        //选择规格
        count: 1,
        showSpec: false,
        specText: '请选择规格',
        //默认属性
        defaultproperty: 1,
        evaType: [{
            tit: "好评"
        }, {
            tit: "中评"
        }, {
            tit: "差评"
        }],
        etActiveIndex: 0,
        evaInfo: [], //评论
        isFixedTap: false,
    },

    onLoad: function(option) {
        this.data.productId = option.id
    },

    onHide: function() {
        this.setData({
            showSpec: false,
        });
    },

    navTap: function(e) {
        this.setData({
            tabID: e.currentTarget.dataset.tab
        });
    },

    bindChooseSpec: function(e) {
        this.setData({
            showSpec: true
        })
    },

    //获取购物车商品数量
    //获取产品详情
    requestProductDetails: function(e) {
        that.setData({
            productDetails: "",
        })
        wx.setNavigationBarTitle({
            title: "名称",
        })
    },
    //获取产品规格
    requestProductSpec: function(e) {},
    //点击收藏产品
    bindCollect: function(e) {},
    //点击购物车
    bindCart: function() {
        wx.switchtab({
            url: '/pages/cart/cart',
        })
    },
    //选择评论
    swichNav: function(e) {},
    //选择规格商品加减
    countMinus: function(e) {
        var that = this;
        var count = that.data.count;
        if (count == 1) {
            that.setData({
                count: 1
            })
        } else {
            count--;
            that.setData({
                count: count
            })
        }
    },
    countAdd: function(e) {
        var that = this;
        let stock = that.data.productDetails.stock;
        var count = that.data.count;
        if (count < stock) {
            count++;
            that.setData({
                count: count
            })
        } else {
            wx.showToast({
                title: '超过库存限制',
                icon: 'none'
            })
            that.setData({
                count: stock
            });
        }
    },
    //点击遮罩层，选择规格隐藏
    distpickerCancel: function(e) {
        this.setData({
            showSpec: false
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
        app.checkLogin();
        //获取数据
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
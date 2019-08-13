const app = getApp();
Page({
    data: {
        currentTab: 0,
        orderList: []
    },
    onLoad: function(options) {
        var currentTab = options.currentTab == undefined ? 0 : options.currentTab
        this.setData({
            currentTab: currentTab
        })
    },
    onShow: function() {
        this.getOrder(this.data.currentTab);
    },
    getOrder: function(status) {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'dingdan/get',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                "memberID": app.globalData.memberID,
                "status": status
            },
            success: function(res) {
                if (res.data.result.status == 200) {
                    that.setData({
                        orderList: res.data.data.object
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
    swichNav: function(e) {
        var currentTab = e.target.dataset.tab
        this.setData({
            currentTab: parseInt(currentTab)
        });
        this.getOrder(currentTab);
    },
    //取消订单
    cancel: function(e) {
        var that = this;
        var id = e.target.dataset.id;
        wx.showModal({
            title: '取消订单',
            content: '是否取消订单',
            success: function(res) {
                if (res.confirm) {

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    //确认收货
    receive: function(e) {
        let that = this;
        let Userid = app.globalData.memberId;
        let id = e.target.dataset.id;
    },
    //申请退款
    refund: function(e) {
        var id = e.target.dataset.id;
        wx.navigateTo({
            url: '/pages/drawback/drawback?id=' + id,
        })
    },
    //去评论
    comment: function(e) {
        var productid = e.target.dataset.proid;
        var orderid = e.target.dataset.orderid;
        wx.navigateTo({
            url: '/pages/evaluation/evaluation?productid=' + productid + '&&orderid=' + orderid,
        })
    },
    //查看申请订单详情
    refundDetails: function(e) {
        wx.navigateTo({
            url: '/pages/refundDetails/refundDetails',
        })
    },
    //查看订单详情
    bindOrderDetails: function(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/orderDetails/orderDetails?id=' + id,
        })
    },
    //立即支付
    payNow: function(e) {
        let id = e.currentTarget.dataset.id;
        let url = '/OrderAPI/buynow';
        let data = {
            id: id
        };
        app.postRequestU(url, data, function(response) {
            wx.hideLoading();
            console.log(response);
            let data = response.data;
            wx.requestPayment({
                'timeStamp': data.msg.timeStamp,
                'nonceStr': data.msg.nonceStr,
                'package': data.msg.package,
                'signType': data.msg.signType,
                'paySign': data.msg.paySign,
                'success': function(res) {
                    wx.redirectTo({
                        url: '/pages/allOrders/allOrders?currentTab=2&otype=3',
                    })
                },
                'fail': function(res) {
                    wx.switchTab({
                        url: '/pages/cart/cart',
                    })
                }
            })
        }, function(response) {
            wx.showToast({
                title: '支付失败',
                icon: 'none'
            })
        });
    },

})
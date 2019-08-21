const app = getApp();
Page({
    data: {
        currentTab: "全部",
        orderList: []
    },
    onLoad: function(options) {
        var currentTab = options.currentTab == undefined ? "全部" : options.currentTab
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
            currentTab: currentTab
        });
        this.getOrder(currentTab);
    },
    setClipboardData: function(e) {
        var data = e.target.dataset.data
        wx.setClipboardData({
            data: data,
            success(res) {
                wx.showToast({
                    title: '已复制到剪贴板',
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    },
    //取消订单
    bindCancel: function(e) {
        var that = this;
        var id = e.target.dataset.id;
        wx.showModal({
            title: '取消订单',
            content: '是否取消订单',
            success: function(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.config.RequestUrl + 'dingdan/delete',
                        method: "GET",
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: {
                            "memberID": app.globalData.memberID,
                            "orderID": id
                        },
                        success: function(res) {
							if (res.data.result.status == 200) {
								wx.showToast({
									title: "取消成功",
									icon: 'success',
									duration: 2000
								})
								that.getOrder(that.data.currentTab);
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
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    //确认收货
    bindReceive: function(e) {
		var that = this;
		var id = e.target.dataset.id;
		wx.showModal({
			title: '确认收货',
			content: '是否确认收货',
			success: function (res) {
				if (res.confirm) {
					wx.request({
						url: app.config.RequestUrl + 'dingdan/shouhuo',
						method: "GET",
						header: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						data: {
							"memberID": app.globalData.memberID,
							"orderID": id
						},
						success: function (res) {
							if (res.data.result.status == 200) {
								wx.showToast({
									title: "收货成功",
									icon: 'success',
									duration: 2000
								})
								that.getOrder(that.data.currentTab);
							} else {
								wx.showToast({
									title: res.data.result.errMsg,
									icon: 'none',
									duration: 2000
								})
							}
						},
						fail: function (e) {
							wx.showToast({
								title: e.errMsg,
								icon: 'none',
								duration: 2000
							})
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
    },
    //立即支付
    bindPay: function(e) {
        var orderIndex = e.currentTarget.dataset.id;
        var order = this.data.orderList[orderIndex]
        var orderInfo = order.zhifu_xinxi.split(" ")
        wx.requestPayment({
            timeStamp: orderInfo[0],
            nonceStr: orderInfo[1],
            package: orderInfo[2],
            signType: 'MD5',
            paySign: orderInfo[3],
            success: function(res) {
                wx.redirectTo({
                    url: '/pages/order/allOrders?currentTab=待发货',
                })
            }
        })
    }
})
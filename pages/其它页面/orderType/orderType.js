const app = getApp();
Page({
  data: {
    order: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.requestInit();
  },
  onReady: function () {
    
  },
  requestInit: function (e) {
    let that = this;
    let Userid = app.globalData.memberId;
    let order = that.data.order;
    //退款

    wx.setNavigationBarTitle({
      title: '退款'
    })
    let url = '/OrderAPI/lisByU';
    let datain = {
      type: 5
    };
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      console.log(res);
      var data = res.data;
      if (data.code == 0) {
        res.data.msg = app.formatProductProp(res.data.msg);
        that.setData({
          order: res.data.msg
        });
      }
    });



  },
  // 再次申请退款
  refundAgain:function(e){
    console.log(e);
    let id = e.target.dataset.id;
    wx.redirectTo({
      url: '/pages/drawback/drawback?id='+id,
    })
  },
  //取消订单
  cancel: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    var Userid = app.globalData.memberId;

    wx.showModal({
      title: '取消订单',
      content: '是否取消订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.config.hostUrl + '/OrderAPI/cancelOrder',
            method: 'POST',
            data: {
              id: id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Userid': Userid
            },
            success: function (res) {
              if (res.data.code === 0) {
                console.log("取消订单成功");
                that.requestInit();
              }
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //查看物流
  express: function (e) {

    var expno = e.target.dataset.expno;
    var exptype = e.target.dataset.exptype;
    var expname = e.target.dataset.expname;
    wx.navigateTo({
      url: '/pages/express/express?no=' + expno + '&&type=' + exptype + '&&expname=' + expname,
    })

  },
  //确认收货
  receive: function (e) {
    var that = this;
    var Userid = app.globalData.memberId;
    var id = e.target.dataset.id;
    wx.request({
      url: app.config.hostUrl + '/OrderAPI/confirmRec',
      method: 'POST',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Userid': Userid
      },
      success: function (res) {
        if (res.data.code === 0) {
          wx.showToast({
            title: '确认收货成功',
            icon: 'none'
          })
          that.requestInit();
        }
      }
    })
  },
  //申请退款
  refund: function (e) {
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/drawback/drawback?id=' + id,
    })
  },
  //去评论
  comment: function (e) {

    // var productid = e.target.dataset.proid;
    var orderid = e.target.dataset.orderid;
    wx.navigateTo({
      url: '/pages/evaluation/evaluation?orderid=' + orderid
    })
  },
  //查看订单详情
  bindOrderDetails: function (e) {

    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/orderDetails/orderDetails?id=' + id,
    })
  },
  //查看申请订单详情
  refundDetails: function (e) {

    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/refundDetails/refundDetails?id=' + id,
    })
  },
  //立即支付
  payNow: function (e) {
    let id = e.currentTarget.dataset.id;
    let url = '/OrderAPI/buynow';
    let data = { id: id };
    app.postRequestU(url, data, function (response) {
      let data = response.data;
      wx.requestPayment({
        'timeStamp': data.msg.timeStamp,
        'nonceStr': data.msg.nonceStr,
        'package': data.msg.package,
        'signType': data.msg.signType,
        'paySign': data.msg.paySign,
        'success': function (res) {
          wx.redirectTo({
            url: '/pages/allOrders/allOrders?currentTab=2&otype=3',
          })
        },
        'fail': function (res) {
          wx.switchTab({
            url: '/pages/cart/cart',
          })
        }
      })
    }, function (response) {
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
    });
  },

})
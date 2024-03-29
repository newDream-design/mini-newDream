const app = getApp();
Page({
  data: {
    id:'',
    orderInfo:[]
  },
  onLoad:function(options){
  
    var that = this;
  
    var id = options.id;
    that.setData({
      id:id
    })
    that.requestInit();
  },
  onReady:function(){
  
  },
  requestInit:function(){
    var that = this;
    var id = that.data.id;
    var Userid = app.globalData.memberId;
    //获取订单信息
    let url = '/OrderAPI/sinByI';
    let datain = {
      id: id
    };
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      res.data.msg = app.formatProp(res.data.msg);
      if (res.data.code === 0) {
        that.setData({
          orderInfo: res.data.msg
        })
      }else{
        wx.showToast({
          title: '获取订单失败',
          icon:'none'
        })
      }
    });
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
          let url = '/OrderAPI/cancelOrder';
          let datain = {
            id: id
          }
          app.postRequestU(url, datain, function (res) {
            wx.hideLoading();
            var data = res.data;
            if (data.code === 0) {
              wx.showToast({
                title: '订单已取消',
                icon: 'none'
              })
              that.getOrder();
            }
          });
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
    let that = this;
    let Userid = app.globalData.memberId;
    let id = e.target.dataset.id;
    let url = '/OrderAPI/confirmRec';
    let datain = {
      id: id
    }
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      var data = res.data;
      if (data.code === 0) {
        wx.showToast({
          title: '确认收货成功',
          icon: 'none'
        })
        that.setData({
          currentTab: 4,
          type: 6
        });
        that.getOrder();
      }
    });
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

    var productid = e.target.dataset.proid;
    var orderid = e.target.dataset.orderid;
    wx.navigateTo({
      url: '/pages/evaluation/evaluation?productid=' + productid + '&&orderid=' + orderid,
    })
  },

  //查看申请订单详情
  refundDetails: function (e) {
    wx.navigateTo({
      url: '/pages/refundDetails/refundDetails',
    })
  },
  //查看订单详情
  bindOrderDetails: function (e) {

    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/orderDetails/orderDetails?id=' + id,
    })
  },
  //立即支付
  payNow: function (e) {
    let id = e.currentTarget.dataset.id;
    let url = '/OrderAPI/buynow';
    let data = { id: id };
    app.postRequestU(url, data, function (response) {
      wx.hideLoading();
      console.log(response);
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
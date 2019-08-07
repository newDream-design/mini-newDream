// pages/confirmOrder/confirmOrder.js
/**
 * 用户结算页面
 */
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addresswrap: [],//地址的全部信息
    addressmsg: {},//地址信息
    productsmsg: {},//购物车结算产品信息
    proallnum: 0,//产品总数
    proallprice: 0,//产品总金额
    trafficprice: 0,//运费
    allprice: 0,//总价格
    ids: [],//购物车id 
    ordernote: '',//订单留言
    addressid: 0//地址id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '请选择收货地址',
      icon: 'none'
    })
   
    var that = this;
    if (options.addressid) {
      that.setData({
        addressid: options.addressid
      })
    }
    that.setData({
      ids: options.ids,
    })
    // that.getAddress(that.data.addressid);
    that.getProductslist(options.ids);
  },
  onReady: function () {
    
  },

  /**
   * 获取地址
   */
  // getAddress: function (addressid) {
  //   //是否传id，不传为默认
  //   if (!addressid) {
  //     var url = '/MemberaddressAPI/sinByM';
  //     var datain = {};
  //   } else {
  //     var url = '/MemberaddressAPI/sinByI';
  //     var datain = { id: addressid };
  //   }

  //   var that = this;

  //   app.postRequestU(url, datain, function (res) {

  //     var data = res.data;
  //     if (data.code == 0 && data.msg) {
  //       that.setData({
  //         addressmsg: data.msg,
  //       })
  //     }else {
  //       wx.showToast({
  // 	      icon: 'none',
  // 	      title: '请添加默认收货地址',
  //       })
  //     }
  //   })
  // },

  /**
   * 获取传入的购物车产品
   */
  getProductslist: function (ids) {
    var that = this;
    var url = '/ShoppingcartAPI/lisByIds';
    var datain = { ids: ids };

    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      var data = res.data;
      if (data.code == 0) {
        var proallprice = 0;
        var freightprice = 0;
        for (let i in data.msg) {
          var property = '';
          proallprice += parseFloat(data.msg[i].price) * parseInt(data.msg[i].num);
          freightprice += parseFloat(data.msg[i].freightprice);
          for (var key in JSON.parse(data.msg[i].property)) {
            property += key + ":" + JSON.parse(data.msg[i].property)[key] + " , ";
          }
          property = property.substring(0, property.length - 2);
          data.msg[i].property = property;
        }
        that.setData({
          productsmsg: data.msg,
          proallnum: data.msg.length,
          proallprice: proallprice.toFixed(2),
          trafficprice: freightprice.toFixed(2),
          allprice: proallprice.toFixed(2)
        })
      }
    })
  },

  /**
   * 添加订单
   */
  orderAdd: function () {
    var that = this;
    let addresswrap = that.data.addresswrap;
    if (addresswrap.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择地址！',
      })
      return false;
    }

    let orderaddress = addresswrap.provinceName + addresswrap.cityName + addresswrap.countyName + addresswrap.detailInfo;
    let url = '/OrderAPI/add/';
    let datain = {
      // memberaddress: addressmsg.id,
      shoppingcart: that.data.ids,
      ordernote: that.data.ordernote,
      ordercontact: that.data.addresswrap.userName,
      ordermobile: that.data.addresswrap.telNumber,
      orderaddress: orderaddress,
      zipcode: that.data.addresswrap.postalCode,
    };
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      console.log(res);
      var data = res.data;
      if (data.code === 0) {
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
      }
    })
  },

  /**
   * 获取订单留言
   */
  getOrdernote: function (e) {
    this.setData({
      ordernote: e.detail.value
    })
  },
  //跳转微信收货地址
  chooseAddress: function (e) {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(res);

        let addresswrap = that.data.addresswrap;

        that.setData({
          addresswrap: res
        })
      }
    })

  },
})
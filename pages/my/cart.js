// pages/cart/cart.js
/**
 * 购物车页面
 */
const app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
  data: {
    selectedAllStatus: {},
    winWidth: 0,
    winHeight: 0,
    hotprolist: {},//热门产品
    carts: '',//购物车信息
    total: 0,//价格总计

  },
  onLoad: function () {
    
   
  },
  onShow: function () {
    let that = this;
    that.initSystemInfo();
    that.hotproduct();
    that.requestInit();
  },
  onReady: function () {
   
  },
  initSystemInfo: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

	/**
	 * 获取热门产品
	 */
  hotproduct: function () {
    var that = this;
    var url = '/ProductsAPI/lisByI';
    var datain = { page: 1, pgsize: 4 };

    app.getRequestU(url, datain, function (res) {
      wx.hideLoading();
      var data = res.data;
      if (data.code == 0) {
        that.setData({
          hotprolist: data.msg,
        });
      }
    })
  },
	/**
	 * 获取购物车信息
	 */
  requestInit: function () {
    //获取购物车信息
    var that = this;
    var url = '/ShoppingcartAPI/lisByU';
    var datain = {};
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      var data = res.data;
      if (data.code == 0) {
        that.setData({
          carts: data.msg,
        });
        that.sum();
        that.checkAll();
      }
    });
  },
  // 减
  bindMinus: function (obj) {
    var that = this;
    var num = obj.currentTarget.dataset.num;//数量
    var id = obj.currentTarget.dataset.id;//id
    var index = obj.currentTarget.dataset.index;//序号
    if (num <= 1) {

    } else {
      num--;
      var url = '/ShoppingcartAPI/updNByI';
      var data = { num: num, id: id };

      app.postRequestU(url, data, function (res) {
        wx.hideLoading();
        var data = res.data;
        if (data.code == 0) {
          var carts = [];
          that.data.carts[index].num = num;
          that.setData({
            carts: that.data.carts,
          });
        }
      });
      that.sum();
    }
  },
  // 加
  bindPlus: function (obj) {
    var that = this;
    var num = obj.currentTarget.dataset.num;//数量
    var id = obj.currentTarget.dataset.id;//id
    var index = obj.currentTarget.dataset.index;//序号
    if (num >= 99) {

    } else {
      num++;
      var url = '/ShoppingcartAPI/updNByI';
      var data = { num: num, id: id };
      var Userid = app.globalData.memberId;

      app.postRequestU(url, data, function (res) {
        wx.hideLoading();
        var data = res.data;
        if (data.code == 0) {
          that.data.carts[index].num = num;
          that.setData({
            carts: that.data.carts,
          });
        }

      });
      that.sum();
    }
  },

	/**
	 * 单个选择
	 */
  bindCheckbox: function (e) {
   
    let that = this;
    let check = e.target.dataset.check == 0 ? '1' : '0';
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
    let carts = this.data.carts;
    let url = '/ShoppingcartAPI/updIByI';
    let datain = {
      id: id,
      ischeck: check
    };
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      if (res.data.code === 0) {
        that.requestInit();
      }
    });
  },

  //  单个全部选中，则全选选中
  checkAll: function () {
    //获取购物车的信息
    let that = this;
    let url = '/ShoppingcartAPI/lisByU';
    let datain = {};
    app.getRequestU(url, datain, function (res) {
      wx.hideLoading();
      if (res.data.code === 0) {
        let checkedCount = 0;
        for (let i = 0; i < res.data.msg.length; i++) {
          if (res.data.msg[i].ischeck == '0') {
            checkedCount++;
          }
        }
        if (checkedCount === 0) {
          that.setData({
            selectedAllStatus: true
          })
        } else {
          that.setData({
            selectedAllStatus: false
          })
        }
      }
    })
  },

	/**
	 * 全选
	 */
  bindAllChoose: function (e) {
    let that = this;
    let selectedAllStatus = that.data.selectedAllStatus;
    let url = '/ShoppingcartAPI/updIByU';
    let check = selectedAllStatus == true ? 0 : 1;
    let datain = { ischeck: check };
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      if(res.data.code===0){
        that.requestInit();
      }else{
        wx.showToast({
          title: '网络错误',
          icon:'none'
        })
      }
    });

  },
	/**
	 * 统计
	 */
  sum: function (e) {
    var carts = this.data.carts;
    var total = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].ischeck == '1') {
        total += carts[i].num * carts[i].price;
      }
    }
    this.setData({
      total: total.toFixed(2)
    })
  },
  //结算，判断选中并跳转
  bindBalance: function () {
    var that = this;
    var carts = that.data.carts;
    var ids = [];
    for (var i in carts) {
      if (carts[i].ischeck == '1') {
        ids.push(carts[i].id);
      }
    }
    if (ids.length <= 0) {
      wx.showToast({
        title: '未选择结算产品！',
        icon: "none"
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/confirmOrder/confirmOrder?ids=' + JSON.stringify(ids)
    })
  },
  delCart: function (e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let url = '/ShoppingcartAPI/delByIds';
    let ids = [];
    let that = this;
    ids.push(id);
    ids = JSON.stringify(ids);
    let data = { ids: ids };
    let carts = that.data.carts;

    carts.splice(index, 1);
    app.postRequestU(url, data, function (response) {
      wx.hideLoading();
      that.setData({
        carts: carts,
      });
      // wx.showToast({
      // 	title:response.data.msg
      // });
    }, function (response) {
      wx.showToast({
        title: response.data.msg,
        icon: "none"
      });
    });
  },
  //点击图片，商品名称跳转
  bindGoods: function (e) {
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/goodsDetails/goodsDetails?id=' + id,
    })
  },
  //去逛逛
  goShopping: function (e) {
    wx.navigateTo({
      url: '/pages/classify/classify?productcategory=&searchmsg=',
    })
  },
});
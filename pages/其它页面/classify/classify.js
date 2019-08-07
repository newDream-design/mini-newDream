//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    isHideLoadMore: true,
    isNoMore: true,
    winWidth: 0,
    winHeight: 0,
    goods: [],
    searchmsg: '',
    productcategory: '',
    sellout: '',
    addtime: '',
    price: '',
    page: 1,
    pgsize: 8,
    activeIndex: 0,
    sortType: [{
        title: '综合',
        otype: 'all'
      },
      {
        title: '销量',
        otype: 'sellout'
      },
      {
        title: '新品',
        otype: 'addtime'
      },
      {
        title: '价格',
        otype: 'price'
      },
    ],
    scrollHeight: 0
  },
  onLoad: function(options) {
    console.log(options);
    wx.showShareMenu({
      withShareTicket: true,
    })

    let that = this;
    let productcategory = options.productcategory;
    let searchmsg = options.searchmsg;
    that.initSystemInfo();
    that.setData({
      productcategory: productcategory,
      searchmsg: searchmsg
    })
    that.requestInit();
  },
  onReady: function() {

    this.getScrollHeight();
  },
  onShareAppMessage() {
    try {
      let memberId = wx.getStorageSync('memberId')
      console.log(memberId);
      if (memberId) {
        return {
          title: '苏州美途电商平台',
          path: '/pages/classify/classify?id=' + memberId,
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

  },
  getScrollHeight: function() {
    let that = this;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    query.select('#classifyBox').boundingClientRect()
    query.exec(function(res) {
      //取高度
      console.log(res[0].height);
      let viewHeight = res[0].height;
      let winHeight = that.data.winHeight;
      let scrollHeight = winHeight - viewHeight;
      that.setData({
        scrollHeight: scrollHeight
      })
    })
  },
  initSystemInfo: function() {
    let that = this;

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  //搜索产品
  search: function(e) {
    const that = this;
    let searchMsg = e.detail.value.searchmsg;
    if (!searchMsg) {
      wx.showToast({
        title: '请输入您想搜索的商品',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    // that.dropProductCategory ();

    let url = '/ProductsAPI/lisByO';
    let datain = {
      searchmsg: searchMsg,
    };

    app.getRequestU(url, datain, function(res) {
      wx.hideLoading();
      if (res.data.code === 0) {
        that.setData({
          goods: res.data.msg,
          productcategory: '',
          sellout: '',
          addtime: '',
          price: '',
          page: page,
          pgsize: pgsize
        })
      }

    })
  },

  requestInit: function(e) {
    const that = this;
    //请求所有产品
    let searchmsg = that.getSearchMsg();
    let url = '/ProductsAPI/lisByO';
    let datain = {
      searchmsg: searchmsg,
      // productcategory: that.getProductCategory(),
      productcategory: that.data.productcategory,
      sellout: that.data.sellout,
      addtime: that.data.addtime,
      price: that.data.price,
      page: that.data.page,
      pgsize: that.data.pgsize
    };
    app.getRequestU(url, datain, function(res) {
      wx.hideLoading();
      var data = res.data;
      if (data.code === 0) {
        that.setData({
          goods: res.data.msg,
          searchmsg: searchmsg,
          scrollTop: 0
        })
        if (res.data.msg.length < 7) {
          that.setData({
            isNoMore: false
          })
        }
      }
    });
  },
  //加载更多
  loadProductsMore: function(e) {
    console.log('加载更多');
    let that = this;
    let page = that.data.page;
    let pgsize = that.data.pgsize;
    let searchmsg = that.getSearchMsg();
    that.setData({
      isHideLoadMore: false,
      isNoMore: true
    });
    page++;
    let url = '/ProductsAPI/lisByO';
    let datain = {
      searchmsg: searchmsg,
      // productcategory: that.getProductCategory(),
      productcategory: that.data.productcategory,
      page: page,
      pgsize: pgsize,
      sellout: that.data.sellout,
      addtime: that.data.addtime,
      price: that.data.price,
    };
    app.getRequestU(url, datain, function(res) {
      wx.hideLoading();
      if (res.data.code == 0) {
        that.setData({
          isHideLoadMore: true
        })
        let reqGoods = res.data.msg;
        let tempGoods = that.data.goods;
        for (let i = 0; i < reqGoods.length; i++) {
          tempGoods.push(reqGoods[i]);
        }
        that.setData({
          goods: tempGoods,
          page: page
        });
        if (reqGoods.length < 7) {
          that.setData({
            isNoMore: false
          })
        }
      }
    });
  },
  bindClassifyDetails: function(e) {
    // wx.redirectTo ({
    // 	url: '../classifyDetails/classifyDetails',
    // })
    wx.switchTab({
      url: '/pages/classifyPage/classifyPage',
    })
  },
  //点击排序类别
  active: function(e) {
    const that = this;
    that.setData({
      activeIndex: e.currentTarget.id,
    })

    //点击综合排序
    if (e.target.dataset.otype == "all") {
      that.setData({
        page: 1,
        pgsize: 8,
        sellout: '',
        addtime: '',
        price: ''
      });
      that.requestInit();
    }

    //点击销量
    if (e.target.dataset.otype == "sellout") {
      let sellout = that.data.sellout;
      if (sellout == '') {
        sellout = 1;
      } else if (sellout == 1) {
        sellout = 2;
      } else if (sellout == 2) {
        sellout = 1;
      }
      that.setData({
        sellout: sellout,
        page: 1
      })
      that.requestInit();
    } else {
      that.setData({
        sellout: ''
      })
    }
    //点击新品
    if (e.target.dataset.otype == "addtime") {
      let addtime = that.data.addtime;
      if (addtime == '') {
        addtime = 1;
      }
      that.setData({
        addtime: addtime,
        page: 1
      });
      that.requestInit();
    } else {
      that.setData({
        addtime: ''
      })
    }
    //点击价格
    if (e.target.dataset.otype == "price") {
      let price = that.data.price;
      if (price == '') {
        price = 1;
      } else if (price == 1) {
        price = 2;
      } else if (price == 2) {
        price = 1;
      }

      that.setData({
        price: price,
        page: 1
      })
      that.requestInit();
    } else {
      that.setData({
        price: ''
      })
    }
  },
  /**
   * 获取搜索值
   * @returns {string}
   */
  getSearchMsg: function() {
    return this.data.searchmsg;
  },

  /**
   * 获取产品类别id
   * @returns {*}
   */
  getProductCategory: function() {
    return app.globalData.productCategory;
  },
});
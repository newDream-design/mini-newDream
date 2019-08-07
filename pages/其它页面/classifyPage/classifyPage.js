const app = getApp();
Page({
  data: {
    // types: null,
    // typeTree: {}, // 数据缓存
    currType: 0,
    defaultParent: '',
    // 当前类型
    types: [],
    typeTree: [],
  },
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
    })
  },
  onShow: function () {
    if (!!app.globalData.currType) {
      let currType = app.globalData.currType;
      this.setData({
        currType: currType
      })
      this.requestInit(currType);
    }else{
      let currType = this.data.currType;
      this.requestInit(currType);
    }
  },
  onReady: function () {
    
  },
  onShareAppMessage() {
    try {
      let memberId = wx.getStorageSync('memberId')
      console.log(memberId);
      if (memberId) {
        return {
          title: '苏州美途电商平台',
          path: '/pages/classifyPage/classifyPage?id=' + memberId,
          imageUrl: '',
          success: function (res) {
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
  requestInit: function (currType) {
    const that = this;
    //获取产品类别
    let url = '/ProductcategoryAPI/lisByP';
    let datain = {
      parentid: 0
    };
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      console.log(res);
      if (res.data.code === 0) {
        that.setData({
          types: res.data.msg,
          defaultParent: res.data.msg[currType].id
        })
        //默认获取第一个父类的子类
        let defaultParent = that.data.defaultParent;
        let datain1 = {
          parentid: defaultParent
        };
        app.postRequestU(url, datain1, function (res) {
          wx.hideLoading();
          if (res.data.code === 0) {
            that.setData({
              typeTree: res.data.msg
            })
          }
        });
      }
    });
  },
  //点击父类获取子类
  tapType: function (e) {

    let that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.id;
    app.globalData.currType = index;

    that.setData({
      currType: index
    })
    let url = '/ProductcategoryAPI/lisByP';
    let datain = {
      parentid: id
    }
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      if (res.data.code === 0) {
        that.setData({
          typeTree: res.data.msg
        })
      }
    })
  },
  //点击搜索
  search: function (e) {

    let searchmsg = e.detail.value.searchmsg;
    if (searchmsg == '') {
      wx.showToast({
        title: '请输入搜索的商品名',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/classify/classify?searchmsg=' + searchmsg + '&&productcategory=',
      })
    }
  }
})
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aboutUs: [],
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
    //获取关于我们内容
    let that = this;
    let url = '/AboutmeAPI/lisByS';
    let datain = {};
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      console.log(res);
      if (res.data.code === 0) {
        that.setData({
          aboutUs: res.data.msg
        })
      }
    })
  },
  // 拨打电话
  getPhone: function (e) {

    let phoneNumber = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },
  // 获取定位
  getAddress: function (e) {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude =  Number(that.data.aboutUs.latitude);
        var longitude = Number(that.data.aboutUs.longitude);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  }
})
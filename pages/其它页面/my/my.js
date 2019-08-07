const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
    count1:'',
    count2:'',
    count3:'',
    count4:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
   
  },
  onReady: function () {
   
  },
  onShow: function () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: userInfo,
    })
    that.getOrderCount();
  },
  getOrderCount:function(){
    let that = this;
    let url = '/OrderAPI/couMsg';
    let data1 = {type:2};
    let data2 = {type:3};
    let data3 = {type:4};
    let data4 = {type:6};
    app.postRequestU(url, data1, function (res) {
      wx.hideLoading();
      if(res.data.code===0){
        that.setData({
          count1:res.data.msg
        })
      }
    });
    app.postRequestU(url, data2, function (res) {
      wx.hideLoading();
      if (res.data.code === 0) {
        that.setData({
          count2: res.data.msg
        })
      }
    });
    app.postRequestU(url, data3, function (res) {
      wx.hideLoading();
      if (res.data.code === 0) {
        that.setData({
          count3: res.data.msg
        })
      }
    });
    app.postRequestU(url, data4, function (res) {
      wx.hideLoading();
      if (res.data.code === 0) {
        that.setData({
          count4: res.data.msg
        })
      }
    });
  },
  address:function(e){
    wx.chooseAddress({
      success:function(res){
        console.log(res);
      },
      fail:function(res){

      },
      complete:function(res){

      }
    })
  },
  login: function (e) {
    console.log(e);
    wx.clearStorage();
    let that = this;
    if (e.detail.userInfo) {
      let userInfo = e.detail.userInfo;
      wx.setStorageSync('userInfo', userInfo);
      that.setData({
        userInfo: e.detail.userInfo,
      })
      wx.login({
        success: function (res) {
          console.log(res);
          if (res.code) {
            let code = res.code;
            app.thirdLogin(code);
          } else {
            console.log('code获取失败');
            wx.showToast({
              icon: 'none',
              title: '登录失败'
            })
          }
        }
      })
    } else {
      wx.showModal({
        showCancel: false,
        title: '无法完成登录',
        content: '需要获取用户信息用来登录，请重试登录.',
      })
    }

  },
})
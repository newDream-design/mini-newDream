const app = getApp();
Page({
  data: {
    collections: [],
    productid: ''
  },
  onLoad: function (option) {
   
    this.requestInit();
  },
  onReady:function(){
  
  },
  requestInit: function (e) {
    //获取收藏的产品
    let that = this;
    let url = '/FavoriteAPI/lisByM';
    let datain = {};
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      console.log(res);
      if (res.data.code === 0) {
        that.setData({
          collections: res.data.msg
        })
      }
    });
  },
  bindCollectAct: function (e) {
    var that = this;
    var productid = e.currentTarget.dataset.id;
    var Userid = app.globalData.memberId;
    var ids = JSON.stringify({ productid })
   
    wx.showModal({
      title: '删除收藏',
      content: '是否删除此收藏的产品？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //取消收藏
          let url = '/FavoriteAPI/delByP';
          let datain = { ids: ids };
          app.postRequestU(url, datain, function (res) {
            wx.hideLoading();
            if (res.data.code === 0) {
              wx.showToast({
                title: '删除成功',
              })
              that.requestInit();
            } else {
              wx.showToast({
                title: '删除失败',
              })
            }
          });
        }
      }
    })
  }
})
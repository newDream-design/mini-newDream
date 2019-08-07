const app = getApp();
Page({
  data: {
    expressInfo: [],
    type: '',
    postid: '',
    expname: '',
    winHeight: '0',
    winWidth: '0'
  },
  onLoad: function (options) {
 

    var that = this;
    that.initSystemInfo();
    var postid = options.no;
    var type = options.type;
    var expname = options.expname;
    that.setData({
      expname: expname,
      postid: postid,
      type: type
    })
    that.express();
  },
  onReady:function(){
    
  },
  onShow: function () {
    wx.hideLoading();
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
  //查询物流信息
  express: function (e) {
    wx.showLoading({
      title: '查询中',
    })
    let that = this;
    let postid = that.data.postid;
    let type = that.data.type;
    wx.request({
      url: 'https://m.kuaidi100.com/query',
      data: {
        type: type,
        postid: postid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res.data)
        if (res.data.message === 'ok') {
          that.setData({
            expressInfo: res.data.data
          })
        }
      }
    })
  }


})
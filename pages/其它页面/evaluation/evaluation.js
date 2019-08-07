const app = getApp();
Page({
  data: {
    orderInfo: [],
    nickname: '',
    orderid: '',
    commentgrade: '1',
    evatype: []
  },
  onLoad: function (options) {
   
    var that = this;
    var orderid = options.orderid;
    that.setData({
      orderid: orderid
    })

    that.getOrder(orderid);
  },
  onReady: function () {
    
  },
  //获取订单信息
  getOrder: function (orderid) {
    let that = this;
    let evatype = [];
    let url = '/OrderAPI/sinByI';
    let datain = {
      id: orderid
    }
    app.postRequestU(url, datain, function (res) {
      wx.hideLoading();
      if (res.data.code == 0) {
       
        let orderInfo = res.data.msg;
        for (let i = 0; i < orderInfo.promsg.length; i++) {
          orderInfo.promsg[i].commentType = '1';
        }
        that.setData({
          orderInfo: orderInfo
        })
      }
    });
  },
  //选择评价类型
  selCommentType: function (e) {
    let orderInfo = this.data.orderInfo;
    let index = parseInt(e.currentTarget.dataset.index);
    orderInfo.promsg[index].commentType = e.currentTarget.dataset.type;
    this.setData({
      orderInfo: orderInfo
    });
  },
  //保存评价
  saveContent: function (e) {
    console.log(e);
    let that = this;
    let orderInfo = that.data.orderInfo;
    let index = e.currentTarget.dataset.index;
    orderInfo.promsg[index].content = e.detail.value;
    that.setData({
      orderInfo: orderInfo
    });

  },


  //提交评价
  evaSubmit: function (e) {
    let that = this;
    let commentList = [];
    let userInfo = wx.getStorageSync(
      'userInfo'
    );
    let author = userInfo.nickName;
    let orderid = that.data.orderid;
    let orderInfo = that.data.orderInfo;
    for (let i = 0; i < orderInfo.promsg.length; i++) { 
      commentList.push({
        productid: orderInfo.promsg[i].proid,
        commentgrade: orderInfo.promsg[i].commentType,
        content: orderInfo.promsg[i].content,
        orderid:orderid,
        author:author
      })
    }
   
    let url = '/CommentsAPI/add';
    app.postRequestU(url, { datanew: JSON.stringify(commentList) }, function (res) {
      wx.hideLoading();
      wx.showToast({
        title: res.data.msg,
        success: function () {
          wx.redirectTo({ url: '/pages/allOrders/allOrders?currentTab=0&otype=1'});
        }
      });
    });
  },


  // evaSubmit: function (e) {
  // 	var that = this;
  // 	var author = app.globalData.userInfo.nickName;
  // 	var orderid = that.data.orderid;
  //   var datanew=[];
  //   let evatype = that.data.evatype;

  //   for (let index in that.data.orderInfo.promsg){
  //     let dataonein = {};
  //     dataonein.productid = that.data.orderInfo.promsg[index].proid;
  //     dataonein.orderid = orderid;
  //     for (let inindex in evatype[index]){
  //       if (evatype[index][inindex].sel==1){
  //         dataonein.commentgrade = parseInt(inindex)+1;
  //       }
  //     };
  //     dataonein.author = author;
  //     dataonein.content = e.detail.value['content-' + index];
  //     datanew.push(dataonein);
  //   }

  //   let url = '/CommentsAPI/add';
  //   app.postRequestU(url, { datanew: JSON.stringify(datanew)}, function (res) {
  //     wx.showToast({
  //       title: res.data.msg,
  //       success: function () {
  //         wx.redirectTo({ url: '/pages/allOrders/allOrders?currentTab=0&otype=1' });
  //       }
  //     });
  //   });

  // },
});
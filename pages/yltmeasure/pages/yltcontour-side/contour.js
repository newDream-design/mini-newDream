var yltplugin = requirePlugin("yltplugin");

Page({
  data: {
    initComplete: false,
    loadCoverView: false,
    canvasCt: {
      canvasW: 0,
      canvasH: 0,
    },
    btnBoxH: 70,
    statusBarHeight: 20,
    navigationStyle:'default',  // must be same as app.json
    corpId: '40e8l0nizjng1wgm5',  // for test only
    brandId: '0001',
    clothId: '0001',
    showTip: false,
    imgScr:{},
    sPathf: '',
    sPaths: '',
  },

  onShow:function(){
    var that=this;
    that.setData({
      showTip: (wx.getStorageSync("tipFlag") == "false") ? false : true,
    });
  },

  onLoad: function (options) {
    var that=this;
    wx.showLoading({
      title: '轮廓计算中...',
      mask: true,
    });
    var sysInfo = wx.getSystemInfoSync();
    that.setData({
      statusBarHeight: sysInfo.statusBarHeight,
      imgScr: wx.getStorageSync('imgSrc'),
    })
    var tmpCanvasCt = {};
    // tmpCanvasCt.canvasH = sysInfo.windowHeight - that.data.btnBoxH - sysInfo.statusBarHeight;
    tmpCanvasCt.canvasH = that.data.navigationStyle == 'custom' ?
      sysInfo.windowHeight - that.data.btnBoxH - sysInfo.statusBarHeight :
      sysInfo.windowHeight - that.data.btnBoxH;
    tmpCanvasCt.canvasW = sysInfo.windowWidth;
    that.setData({
      canvasCt: tmpCanvasCt,
      sPathf: wx.getStorageSync('frontImgPath'),
      sPaths: wx.getStorageSync('sideImgPath'),
    });
    that.setData({
      initComplete: true,
    });
    setTimeout(function () {
      that.setData({
        'loadCoverView': true
      });
    }, 500);
  },

  ready: function(){
    wx.hideLoading();
  },

  navToNext:function(){
    var that=this;

    var inputData = wx.getStorageSync('inputData'); 
    if (inputData.corpId != null && inputData.brandId != null && inputData.clothId != null) {
      that.setData({
        coprId: inputData.corpId,
        brandId: inputData.brandId,
        clothId: clothId,
      });
    } else {
      console.log('Error: input data invalid');
    }

    wx.showLoading({
      title: '尺码计算中...',
      mask:true,
    });
    var userHeight = wx.getStorageSync("userHeight")
    var userGender = wx.getStorageSync("userGender")
    var userWeight = wx.getStorageSync("userWeight")
    var userId = wx.getStorageSync("userId")
    yltplugin.getModelling(userId, userGender, userHeight, userWeight, wx.getStorageSync('appKey'), wx.getStorageSync('appSecret')).then(function (res)     {
      var resultJSON = {};
      console.log(res);
      // 通过URL传递参数
      try {
        if (res.statusCode == 60400){
          //根据身体轮廓获取身体尺寸
          yltplugin.sdkDataGet(4).then(function (res) {
            if (res.statusCode == 60100) {
              wx.hideLoading();
              var measureData = res.data.measureInfo;
              if (measureData != undefined) {
                resultJSON["recordId"] = res.data.measureId;
                for (var i = 0; i < measureData.length; i++) {
                  var sizeId = measureData[i].Name.split("size")[1];
                  //01_010胸围
                  if (sizeId == "01_010") {
                    resultJSON["01_010"] = measureData[i].Measure.toFixed(1)
                  }
                  //01_030腰围
                  if (sizeId == "01_030") {
                    resultJSON["01_030"] = measureData[i].Measure.toFixed(1)
                  }
                  //01_060低腰围
                  if (sizeId == "01_060") {
                    resultJSON["01_060"] = measureData[i].Measure.toFixed(1)
                  }
                  //01_040臀圍
                  if (sizeId == "01_040") {
                    resultJSON["01_040"] = measureData[i].Measure.toFixed(1)
                  }
                  //11_030裤长(至裤腰线)
                  if (sizeId == "11_030") {
                    resultJSON["11_030"] = measureData[i].Measure.toFixed(1)
                  }
                  //03_010肩寛
                  if (sizeId == "03_010") {
                    resultJSON["03_010"] = measureData[i].Measure.toFixed(1)
                  }
                  //04_020颈围
                  if (sizeId == "04_020") {
                    resultJSON["04_020"] = measureData[i].Measure.toFixed(1)
                  }
                  //09_010大腿根圍
                  if (sizeId == "09_010") {
                    resultJSON["09_010"] = measureData[i].Measure.toFixed(1)
                  }
                }
                console.log(resultJSON);
                wx.navigateTo({
                  url: '../client-result/result?result=' + JSON.stringify(resultJSON),
                })
              } 
            }
            else {
              wx.hideLoading();
              wx.showToast({
                title: '量体失败-103',
                icon: 'loading',
                duration: 1000,
              });
            }
          })
          // wx.hideLoading();

        }
        else {
          wx.hideLoading();
          wx.showToast({
            title: '量体失败-103',
            icon: 'loading',
            duration: 1000,
          });
        }
      }catch (e) {
        console.log(e);
        wx.showToast({
          title: '量体失败-102',
          icon: 'none',
          duration: 2000,
        });
      }
    }).catch(function (err) {
      console.log(err);
      wx.showToast({
        title: '量体失败-101',
        icon: 'loading',
        duration: 1000,
      });
    });

    // yltplugin.getSize(that.data.corpId, that.data.brandId, that.data.clothId).then(function (res) {
    //   wx.hideLoading();
    //   console.log(res);
    //   // 通过URL传递参数
    //   try {
    //     if (res.statusCode == 60400 && res.data != undefined && res.data.clothSizeCode != undefined && res.data.clothSizeDescp != undefined) {
    //       wx.navigateTo({
    //         url: '../client-result/result?clothSizeCode=' + res.data.clothSizeCode + '&clothSizeDescp=' + res.data.clothSizeDescp,
    //       });
    //     } else {
    //       wx.showToast({
    //         title: '量体失败-103',
    //         icon: 'loading',
    //         duration: 1000,
    //       });
    //     }
    //   }catch (e) {
    //     console.log(e);
    //     wx.showToast({
    //       title: '量体失败-102',
    //       icon: 'none',
    //       duration: 2000,
    //     });
    //   }
    // }).catch(function (err) {
    //   console.log(err);
    //   wx.showToast({
    //     title: '量体失败-101',
    //     icon: 'loading',
    //     duration: 1000,
    //   });
    // });
  },

  navToPrev:function(){
    var that=this;
    wx.navigateBack({
      delta: 1,
    })
  },
  onChangeTipState: function () {
    var that = this;
    that.setData({
      showTip: (!that.data.showTip)
    })
    console.log("showTip:" + that.data.showTip);
    try {
      wx.setStorageSync('tipFlag', 'false')//tipFlag为false，标识之后不再显示tip
    } catch (e) {
      console.log(e);
    }
    console.log("LocalStorage:" + wx.getStorageSync('tipFlag'))
  },

})
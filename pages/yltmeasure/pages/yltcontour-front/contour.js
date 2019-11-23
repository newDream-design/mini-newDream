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
        navigationStyle: 'default', // must be same as app.json
        // showTip:false,
        sPathf: '',
        sPaths: '',
    },

    onShow: function() {
        var that = this;
    },

    onLoad: function(options) {
        var that = this;
        wx.showLoading({
            title: '轮廓计算中...',
            mask: true,
        });
        var sysInfo = wx.getSystemInfoSync();

        // console.log("getSystemInfoSync:"+sysInfo);
        that.setData({
            statusBarHeight: sysInfo.statusBarHeight,
        });
        var tmpCanvasCt = {};
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
        setTimeout(function() {
            that.setData({
                'loadCoverView': true
            });
        }, 500);
        // showTip: (options.showTip == "true" ? true : false)

    },

    ready: function() {
        var that = this;
        wx.hideLoading();
        // console.log("LocalStorage:" + wx.getStorageSync("tipFlag"));
        // that.setData({
        //   showTip: (wx.getStorageSync("tipFlag") == "false") ? false : true,
        // });
    },

    navToNext: function() {
        var that = this;
        wx.navigateTo({
            url: '../yltcontour-side/contour',
        });

    },

    // onChangeTipState: function () {
    //   var that = this;
    //   that.setData({
    //     showTip: (!that.data.showTip)
    //   })

    // },

    navToPrev: function() {
        var that = this;
        wx.navigateBack({
            delta: 1,
        })
    },

})
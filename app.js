var yltplugin = requirePlugin("yltplugin");
App({
    config: {
        RequestUrl: 'https://newdreamer.cn:8080/api/'
    },
    globalData: {
        memberID: ""
    },
    onLaunch: function() {
        var that = this
        wx.login({
            success: function(res) {
                wx.request({
                    url: that.config.RequestUrl + 'login',
                    method: "GET",
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                        sc_code: res.code
                    },
                    success: function(res) {
                        var memberID = res.data
                        that.globalData.memberID = memberID
                    },
                    fail: function(e) {
                        console.log(e.errMsg)
                    }
                })
            }
        })
        wx.setStorageSync('appKey', '236551971170426880190814152846');
        wx.setStorageSync('appSecret', '6a1e805a8fc1f2403f50cfc84fc163c1');
        setTimeout(function() {
            yltplugin.getConfig(wx.getStorageSync('appKey'), wx.getStorageSync('appSecret')).then(function(res) {
                if (res.statusCode == 60100) {
                    console.log("ylt插件连接成功")
                    // var appList = res.data;
                    // wx.setStorageSync('sdkDataGetAPI', appList.sdkDataGet);
                    // wx.setStorageSync('sdkImgProcessAPI', appList.sdkImgProcess);
                    // wx.setStorageSync('sdkProfileSizeAPI', appList.sdkProfileSize);
                } else {
                    console.log(res);
                }
            }).catch(function(err) {
                console.log(err);
            });
        }, 1000)
    }
})
var yltplugin = requirePlugin("yltplugin");
App({
    config: {
        RequestUrl: 'https://newdreamer.cn:8080/api/'
    },
    globalData: {
        memberID: ""
    },
    onLaunch: function() {
		if (wx.canIUse('getUpdateManager')) {
			const updateManager = wx.getUpdateManager()
			updateManager.onCheckForUpdate(function (res) {
				console.log('--> CheckForUpdate', res)
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					console.log('--> hasUpdate')
					updateManager.onUpdateReady(function () {
						updateManager.applyUpdate()
						/*
						wx.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: function (res) {
								console.log('--> success', res)
								// res: {errMsg: "showModal: ok", cancel: false, confirm: true}
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate()
								}
							}
						})*/
					})
					updateManager.onUpdateFailed(function () {
						// 新的版本下载失败
						/*
						wx.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开~'
						})
						*/
						wx.reLaunch({
							url: '',
						})
					})
				}
			})
		}
        var that = this
        wx.login({
            success: function(res) {
                wx.request({
                    url: that.config.RequestUrl + 'login',
                    method: "GET",
                    dataType: "String",	//熊伟不encode，对于纯数字数据一定要加不解析JSON
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
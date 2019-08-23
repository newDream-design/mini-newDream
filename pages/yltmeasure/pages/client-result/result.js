var yltplugin = requirePlugin("yltplugin");

Page({
	data: {
		clothSizeCode: '',
		// clothSizeDescp:''
		clothSizeRecom: "",
	},

	onLoad: function (options) {
		var that = this;
		console.log(options);
		that.setData({
			clothSizeCode: options.result
		});
		wx.setStorage({
			key: "AIMeasureData",
			data: JSON.parse(that.data.clothSizeCode),
			success: function () {
				wx.navigateBack({
					delta: 4
				})
			}
		})
	},

	getSizeRecom: function () {
		var that = this;
		yltplugin.sdkDataGet(5).then(function (res) {
			if (res.statusCode == 60100) {
				that.setData({
					clothSizeRecom: JSON.stringify(res.data)
				});
			}

		})
	}

})
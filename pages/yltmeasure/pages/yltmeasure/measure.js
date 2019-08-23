const app = getApp()
var yltplugin = requirePlugin("yltplugin");
const fileManager = wx.getFileSystemManager();
Page({
	data: {
		corpId: '40e8l0nizjng1wgm5', // for test only
		userId: '-1', //provided by client
		genderList: ['帅哥', '美女'],
		userGender: 1, // (0=female, 1=male)
		userHeight: 180.0, // in cm
		userWeight: 75.0, // in kg
		checkboxStatus: false,
		camList: [],
		tutorialList: [],
		// errMsgList:[],
		camOn: false,
		tutorialOn: false,
		frontPoseSrc: '../../assets/img/front-pose-male-refimg.png',
		sidePoseSrc: '../../assets/img/side-pose-male-refimg.png',
		frontImgSrc: '',
		sideImgSrc: '',
		tutorialW: 0,
		tutorialH: 0,
		error: false,
		errText: []
	},
	onLoad: function (options) {
		var that = this;
		that.setData({
			//coprId: options.corpId,
			userId: app.globalData.memberID,
			userGender: Number(options.userGender),
			userHeight: Number(options.userHeight),
			userWeight: Number(options.userWeight),
			userInfo: options.userName
		})
		wx.hideLoading();
		wx.showLoading({
			title: '拼命加载中...',
			mask: true,
		});
		try {
			var sysInfo = wx.getSystemInfoSync();
			that.setData({
				tutorialW: sysInfo.windowWidth * 0.9,
				tutorialH: sysInfo.windowHeight * 0.9,
			})
		} catch (e) {
			wx.hideLoading();
			console.log(e);
		}
		if (that.compareVersion(sysInfo.SDKVersion, '1.9.6') < 0) {
			wx.hideLoading();
			wx.showModal({
				title: '提示',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}
		if (wx.canIUse('request')) {
			console.log("YLT: Request supported.");
		} else {
			console.log("YLT: Request not supported.")
			wx.hideLoading();
			wx.showModal({
				title: '提示-80',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}
		if (wx.canIUse('createCameraContext')) {
			console.log("YLT: Camera supported.");
		} else {
			console.log("YLT: Camera not supported.")
			wx.hideLoading();
			wx.showModal({
				title: '提示-81',
				content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}
		if (wx.canIUse('onAccelerometerChange')) {
			console.log("YLT: Accelerometer supported.");
		} else {
			console.log("YLT: Accelerometer not supported.")
			wx.hideLoading();
			wx.showModal({
				title: '提示-82',
				content: '当前微信版本过低或不支持重力传感器，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}
		wx.hideLoading();
	},

	onReady: function () {
		// var that = this;
		// yltplugin.login(that.data.corpId, that.data.userId).then(function (res) {
		//   console.log(res);
		// }).catch(function (err) {
		//   console.log(err);
		// });
	},

	cameraActivate: function (e) {
		var that = this;
		if (e.currentTarget.dataset.imgdir == 'front') {
			that.setData({
				camOn: true,
				camList: [{
					'dir': 'front'
				}]
			});
		} else if (e.currentTarget.dataset.imgdir == 'side') {
			that.setData({
				camOn: true,
				camList: [{
					'dir': 'side'
				}]
			});
		}
	},

	getPhoto: function (e) {
		wx.showLoading({
			title: '图片上传中...',
			mask: true,
		});
		var that = this;
		console.log(e.detail);
		that.setData({
			camOn: false,
			camList: [],
		});
		//60200照片拍摄；60230相册照片上传
		if (e.detail.statusCode == 60200 || e.detail.statusCode == 60230) {
			var photoType = -1; //图片类型。1-正面，2-侧面
			if (e.detail.camDir == 'front') {
				photoType = 1;
				that.setData({
					frontImgSrc: e.detail.tempImagePath,
				});
				yltplugin.sdkImgProcess(that.data.userId, that.data.userInfo, that.data.userGender, that.data.userHeight, that.data.userWeight, that.data.frontImgSrc, photoType, wx.getStorageSync('appKey'), wx.getStorageSync('appSecret'), "front").then(function (res) {
					wx.hideLoading();
					console.log(res);
					if (res.statusCode == 60100) {
						that.setData({
							error: false
						})
					} else if (res.statusCode == 60102) {
						that.setData({
							errText: res.data
						});
						that.setData({
							error: true
						})
						that.setData({
							frontImgSrc: '',
						});
					}
				}).catch(function (e) {
					console.log(e);
					that.setData({
						frontImgSrc: '',
					});
					wx.showToast({
						title: "图片上传错误",
						icon: 'none',
						duration: 2000,
					});
				})

				if (e.detail.statusCode == 60200) {
					wx.saveImageToPhotosAlbum({
						filePath: e.detail.tempImagePath,
						success(res) {
							console.log('save photo successfully');
						},
						fail(e) {
							console.log('failed to save photo');
						}
					});
				}
			} else if (e.detail.camDir == 'side') {
				photoType = 2;
				that.setData({
					sideImgSrc: e.detail.tempImagePath,
				});
				yltplugin.sdkImgProcess(that.data.userId, that.data.userInfo, that.data.userGender, that.data.userHeight, that.data.userWeight, that.data.sideImgSrc, photoType, wx.getStorageSync('appKey'), wx.getStorageSync('appSecret'), "side").then(function (res) {
					wx.hideLoading();
					console.log(res);
					if (res.statusCode == 60100) {
						that.setData({
							error: false
						})
					} else if (res.statusCode == 60102) {
						that.setData({
							errText: res.data
						});
						that.setData({
							error: true
						})
						that.setData({
							sideImgSrc: '',
						});
					}
				}).catch(function (e) {
					console.log(e);
					that.setData({
						sideImgSrc: '',
					});
					wx.showToast({
						title: "图片上传错误",
						icon: 'none',
						duration: 2000,
					});
				})
				if (e.detail.statusCode == 60200) {
					wx.saveImageToPhotosAlbum({
						filePath: e.detail.tempImagePath,
						success(res) {
							console.log('save photo successfully');
						},
						fail(e) {
							console.log('failed to save photo');
						}
					});
				}
			} else {
				console.log("ERROR: incorrect photo data.");
			}
		} else if (e.detail.statusCode == 60210) {
			// uploaded image oversize
			wx.hideLoading();
			wx.showToast({
				title: '上传图片请勿大于1MB',
				icon: 'none',
				duration: 2000,
			});
		} else {
			wx.hideLoading();
			console.log(e.detail.statusText);
		}
	},

	closecam: function (e) {
		var that = this;
		// console.log(e.detail);
		that.setData({
			camOn: false,
			camList: []
		});
	},

	navToNext: function () {
		var that = this;
		if (!that.data.checkboxStatus) {
			wx.showToast({
				title: '请阅读并同意《用户条款》',
				duration: 2000,
				icon: 'none'
			})
			return;
		};
		if (that.data.frontImgSrc == '' || that.data.sideImgSrc == '') {
			wx.showToast({
				title: '拍摄或上传正、侧面照片',
				duration: 2000,
				icon: 'none'
			})
			return;
		};
		wx.showLoading({
			title: '轮廓生成中...',
			// mask:true,
		});
		var dataType = 1;
		yltplugin.sdkDataGet(dataType).then(function (res) {
			wx.hideLoading();
			console.log(res);
			// console.log(that.data.frontImgSrc);
			wx.setStorageSync('frontImgPath', that.data.frontImgSrc);
			wx.setStorageSync('sideImgPath', that.data.sideImgSrc);
			wx.setStorageSync('userGender', that.data.userGender);
			wx.setStorageSync('userWeight', that.data.userWeight);
			wx.setStorageSync('userHeight', that.data.userHeight);
			wx.setStorageSync('userId', that.data.userId);
			if (res.statusCode == 60100) {
				wx.navigateTo({
					url: '../yltcontour-front/contour',
				});
				console.log('---');
				wx.showToast({
					title: '量体成功',
					icon: 'success',
					duration: 1500,
				});
			} else if (res.statusCode == 60103) {
				wx.showToast({
					title: '量体失败',
					icon: 'fail',
					duration: 1500,
				});
			}
		}).catch(function (err) {
			wx.hideLoading();
			console.log(err);
		});
	},


	navToTutorial: function () {
		var that = this;
		that.setData({
			tutorialOn: true,
			tutorialList: [{
				id: 1
			}]
		});
	},

	closeTutorial: function () {
		var that = this;
		that.setData({
			tutorialOn: false,
			tutorialList: []
		});
	},

	navToPrivacy: function (e) {
		console.log('e');
		wx.navigateTo({
			url: '../client-privacy/privacy',
		});
	},

	checkboxChange: function (e) {
		var that = this;
		that.setData({
			checkboxStatus: !e.currentTarget.dataset.status
		});
	},

	compareVersion: function (v1, v2) {
		v1 = v1.split('.')
		v2 = v2.split('.')
		var len = Math.max(v1.length, v2.length)

		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}

		for (var i = 0; i < len; i++) {
			var num1 = parseInt(v1[i])
			var num2 = parseInt(v2[i])

			if (num1 > num2) {
				return 1
			} else if (num1 < num2) {
				return -1
			}
		}

		return 0
	},
})
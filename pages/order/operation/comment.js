const app = getApp();
Page({
    data: {
        orderItemID: 0,
        product: {},
        commentList: [{
                "commentKey": "尺寸",
                "commentType": "face",
                "commentTips": ["很小", "偏小", "合身", "偏大", "很大"]
            }, {
                "commentKey": "面料",
                "commentType": "star",
                "commentTips": ["什么玩意", "不如人意", "平平无奇", "OJBK", "卧槽牛逼"]
            }, {
                "commentKey": "做工",
                "commentType": "star",
                "commentTips": ["什么玩意", "不如人意", "平平无奇", "OJBK", "卧槽牛逼"]
            }, {
                "commentKey": "物流",
                "commentType": "star",
                "commentTips": ["什么玩意", "不如人意", "平平无奇", "OJBK", "卧槽牛逼"]
            }, {
                "commentKey": "文字评价",
                "commentType": "textArea",
                "commentTips": ["面料不满意？可以反馈给我们"]
            }
            /*{
                        "commentKey": "您有多大可能再次使用新梦想家商场？",
                        "commentType": "score",
                        "commentTips": ["再也不来了", "真香", "我是铁杆粉"]
                    }, {
                        "commentKey": "图片评价",
                        "commentType": "image"
                    }*/
        ],
        comment: {}
    },
    onLoad: function(options) {
		var product=JSON.parse(options.product)
        this.setData({
            orderItemID: product.orderItemID,
            product: product
        })
        this.initComments()
    },
    //自动生成评价页
    initComments: function() {
        var commentList = this.data.commentList
        var comment = this.data.comment
        for (var id in commentList) {
            comment[commentList[id]["commentKey"]] = 0
        }
        this.setData({
            comment: comment
        })
    },
    //选择评价
    bindCommentSelect: function(e) {
        var key = e.currentTarget.dataset.key
        var id = e.currentTarget.dataset.id
        var comment = this.data.comment
        comment[key] = id
        this.setData({
            comment: comment
        })
    },
    //输入评价
    bindCommentInput: function(e) {
        var key = e.currentTarget.dataset.key
        var text = e.detail.value == "" ? 0 : e.detail.value
        var comment = this.data.comment
        comment[key] = text
        this.setData({
            comment: comment
        })
    },
    bindAddImage: function(e) {
        var that = this
        wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success(res) {
                var image = res.tempFilePaths[0]
                var comment = that.data.comment
                var key = e.currentTarget.dataset.key
                if (comment[key] == 0) comment[key] = []
                comment[key].push(image)
                that.setData({
                    comment: comment
                })
            }
        })
    },
    bindDeleteImage: function(e) {
        var that = this
        wx.showModal({
            title: '提示',
            content: '是否确认删除？',
            success(res) {
                if (res.confirm) {
                    var key = e.currentTarget.dataset.key
                    var id = e.currentTarget.dataset.id
                    var comment = that.data.comment
                    comment[key].splice(id, 1)
                    that.setData({
                        comment: comment
                    })
                }
            }
        })
    },
    //提交评价
    submit: function(e) {
        var comment = this.data.comment
        wx.showLoading({
            title: '评价上传中...',
            mask: true
        })
        for (var i in comment) {
            if (comment[i] == 0) {
                wx.showToast({
                    title: i + "不能为空",
                    icon: 'none',
                    duration: 2000
                })
                wx.hideLoading()
                return
            }
        }
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'pinjia/add',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                "memberID": app.globalData.memberID,
                "orderItemID": that.data.orderItemID,
				"productID_Main": that.data.product.productID_Main,
                "data": JSON.stringify(that.data.comment)
            },
            success: function(res) {
                if (res.data.result.status == 200) {
                    wx.navigateBack()
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: res.data.result.errMsg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: function(e) {
                wx.hideLoading()
                wx.showToast({
                    title: e.errMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    }
});
const app = getApp();
Page({
    data: {
        orderItemID: 10001,
        product: {
            "productID": "ND1M621T",
            "productID_Main": "ND1M621T",
            "productName": "男士西服",
            "image": "1",
            "price": "0.01",
            "count": 1,
            "measureID": 10001,
            "color": "黑色"
        },
        commentList: [{
            "commentKey": "尺寸",
            "commentType": "face",
            "commentTips": ["很小", "偏小", "合身", "偏大", "很大"]
        }, {
            "commentKey": "面料",
            "commentType": "star",
            "commentTips": ["辣鸡玩意", "不如人意", "平平无奇", "OJBK", "卧槽牛逼"]
        }, {
            "commentKey": "做工",
            "commentType": "star",
            "commentTips": ["辣鸡玩意", "不如人意", "平平无奇", "OJBK", "卧槽牛逼"]
        }, {
            "commentKey": "物流",
            "commentType": "star",
            "commentTips": ["辣鸡玩意", "不如人意", "平平无奇", "OJBK", "卧槽牛逼"]
        }, {
            "commentKey": "您有多大可能再次使用新梦想家商场？",
            "commentType": "score",
            "commentTips": ["再也不来了", "真香", "我是铁杆粉"]
        }, {
            "commentKey": "文字评价",
            "commentType": "textArea",
            "commentTips": ["面料不满意？可以反馈给我们"]
        }, {
            "commentKey": "图片评价",
            "commentType": "image"
        }],
        comment: {}
    },
    onLoad: function(options) {
        var orderItemID = options.orderItemID;
        this.setData({
            orderItemID: orderItemID
        })
        //this.getOrderItem(orderItemID);
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
    //获取订单信息
    getOrderItem: function(orderItemID) {},
    //提交评价
    submitComment: function(e) {},

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
    }
});
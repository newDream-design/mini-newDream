const app = getApp();
Page({
    data: {
        categories: [{
            "categoryID": 1,
            "categoryName": "西服",
            "image": "/images/test/d2.jpg",
            "products": [{
                "productID": 101,
                "image": "/images/test/d2.jpg",
                "productName": "我是11条小青龙"
            }, {
                "productID": 102,
                "image": "/images/test/d2.jpg",
                "productName": "我是12条小青龙"
            }]
        }, {
            "categoryID": 2,
            "categoryName": "西裤",
            "image": "/images/test/d2.jpg",
            "products": [{
                "productID": 201,
                "image": "/images/test/d2.jpg",
                "productName": "我是21条小青龙"
            }, {
                "productID": 202,
                "image": "/images/test/d2.jpg",
                "productName": "我是22条小青龙"
            }]
        }],
        currentCategory: 0,
    },
    onLoad: function(options) {
        if (options.currentCategory != undefined) this.data.currentCategory = options.currentCategory
    },
    tapCategory: function(e) {
        this.setData({
            currentCategory: e.currentTarget.dataset.index
        })
    },
    //点击搜索
    search: function(e) {
        var searchmsg = e.detail.value.searchmsg;
        if (searchmsg == "") {
            wx.showToast({
                title: '请输入搜索的商品名',
                icon: 'none'
            })
        } else {

        }
    }
})
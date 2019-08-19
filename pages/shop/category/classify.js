const app = getApp()
Page({
    data: {
        categories: [],
        products: [],
        currentCategory: 0,
        showCategorySelecter: false,
        sortType: [{
            title: '推荐',
            key: 'recommand'
        }, {
            title: '性别',
            key: 'sex'
        }, {
            title: '销量',
            key: 'sale'
        }, {
            title: '价格',
            key: 'price'
        }],
        activeSort: 0,
        sortOrder: 1
    },
    onShow: function() {
        var that = this
        wx.getStorage({
            key: "currentCategory",
            success(res) {
                that.setData({
                    currentCategory: res.data
                })
                wx.removeStorage({
                    key: "currentCategory"
                })
            }
        })
        this.request()
    },
    request: function() {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'fenlei/get',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                //memberID: app.globalData.memberID
            },
            success: function(res) {
                var categories = res.data.data.object
                categories.sort(function(a, b) {
                    return a.image - b.image
                })
                that.setData({
                    categories: categories,
					products: categories[that.data.currentCategory]["products"]
                })
            },
            fail: function(e) {
                wx.showToast({
                    title: e.errMsg,
                    icon: 'none',
                    duration: 2000
                })
            },
            complete: function(e) {
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
            }
        })
    },
    navTap: function(e) {
        var currentCategory = e.currentTarget.dataset.tab
        this.setData({
            currentCategory: currentCategory,
            products: this.data.categories[currentCategory]['products']
        })
    },
    bindCategorySelecter: function() {
        this.setData({
            showCategorySelecter: !this.data.showCategorySelecter
        })
    },
    //点击排序类别
    active: function(e) {
        var activeSort = this.data.activeSort
        var id = parseInt(e.currentTarget.id)
        var key = e.target.dataset.key
        var sortOrder = this.data.sortOrder
        if (key == "recommand") {
            var products = this.data.categories[id]["products"]
        } else {
            if (activeSort == id) sortOrder = -sortOrder
            var products = this.data.products
            products.sort(function(a, b) {
                a = a[key] + ""
                b = b[key] + ""
                return a.localeCompare(b, 'zh-CN') * sortOrder
            })
        }
        this.setData({
            activeSort: id,
            products: products,
            sortOrder: sortOrder
        })

    }
});
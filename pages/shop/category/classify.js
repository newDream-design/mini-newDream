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
            title: '颜色',
            key: 'color'
        }, {
            title: '价格',
            key: 'price'
        }],
        activeSort: 0,
        sortOrder: 1
    },
    onLoad: function(options) {
        if (options.currentCategory != undefined) this.data.currentCategory = options.currentCategory
    },
    onShow: function() {
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
                that.setData({
                    categories: categories,
                    products: categories[0]["products"]
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
        this.setData({
            activeSort: id,
        })
        if (e.target.dataset.key == "price") {
            if (activeSort == id) {
                this.setData({
                    sortOrder: Math.abs(this.data.sortOrder - 1)
                })
            }
        }
    }
});
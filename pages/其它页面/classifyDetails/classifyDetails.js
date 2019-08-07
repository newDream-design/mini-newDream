const app = getApp ();
Page ({

	/**
	 * 页面的初始数据
	 */
	data: {
		classify: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    app.showLoading(this);
		this.requestInit ();
	},
  onReady:function(){
    app.hideLoading(this);
  },
	requestInit: function (e) {
		const that = this;
		//获取产品类别
    let url = '/ProductcategoryAPI/lisByL';
    let datain = {};
    app.getRequestU(url, datain, function (res) {
      if (res.data.code === 0) {
        
        that.setData({
          classify: res.data.msg
        })
      }
    })
  },

	
	filterProductCate: function (e) {
   
    wx.redirectTo({
      url: '/pages/classify/classify?productcategory=' + e.currentTarget.dataset.id+'&searchmsg=',
    })
	},

});
const app = getApp()
Page({
    data: {
        tickets: []
    },
    onShow: function() {
        this.getTicket()
    },
    getTicket: function() {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'youhuiquan/get',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID:app.globalData.memberID
            },
            success: function(res) {
                if (res.data.result.status == 200) {
                    var tickets = res.data.data.object
                    for (var i in tickets) {
                        var date = new Date(tickets[i]["huoqu_shijian"]);
                        date.setHours(date.getHours() + tickets[i]["youxiao_shijian"])
                        tickets[i]["d"] = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + date.getHours() + "时"
                    }
                    that.setData({
                        tickets: tickets
                    })
                } else {
                    wx.showToast({
                        title: res.data.result.errMsg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: function(e) {
                wx.showToast({
                    title: e.errMsg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    }
})
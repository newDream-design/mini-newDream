Page({
    data: {

    },

    onLoad: function(options) {
        wx.setStorageSync('inputData', {
            corpId: '40e8l0nizjng1wgm5', // String，易量体提供 如'40e8l0nizjng1wgm5'
            userId: '123', // String，客户提供的每个用户唯一的识别码
            brandId: '001', // String，易量体提供 如'0001'
            clothId: '001', // String，易量体提供 如'0001'
            userGender: 1, // Integer, 0=female, 1=male
            userHeight: 180, // Integer, in cm
            userWeight: 70, // Integer, in kg
        });
    },


})
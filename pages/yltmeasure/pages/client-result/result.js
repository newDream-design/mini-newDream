var yltplugin = requirePlugin("yltplugin");

Page({
    data: {
        clothSizeCode: '',
        // clothSizeDescp:''
        clothSizeRecom: "",
    },

    onLoad: function(options) {
        var that = this;
        console.log(options);
        that.setData({
            clothSizeCode: options.result,
            // clothSizeDescp: options.clothSizeDescp
        });
    },

    getSizeRecom: function() {
        var that = this;
        yltplugin.sdkDataGet(5).then(function(res) {
            if (res.statusCode == 60100) {
                that.setData({
                    clothSizeRecom: JSON.stringify(res.data),
                    // clothSizeDescp: options.clothSizeDescp
                });
            }

        })
    }

})
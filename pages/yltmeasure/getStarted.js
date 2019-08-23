const app = getApp()
Page({
    data: {
        userData: {},
        AIMeasureData: {},
        inputs: [{
            title: "姓名",
            mode: "input",
            type: "text",
            placeholder: "此姓名将被用于制作水洗标",
            isNecessary: true
        }, {
            title: "性别",
            mode: "select",
            choice: ["男", "女"],
            isNecessary: true
        }, {
            title: "年龄",
            unit: "岁",
            mode: "input",
            type: "number",
            isNecessary: true
        }, {
            title: "身高",
            unit: "cm",
            mode: "input",
            type: "digit",
            placeholder: "例如175",
            isNecessary: true
        }, {
            title: "体重",
            unit: "kg",
            mode: "input",
            type: "digit",
            placeholder: "例如60",
            isNecessary: true
        }, {
            title: "腰围",
            unit: "cm",
            mode: "input",
            type: "digit",
            placeholder: "例如80",
            isNecessary: false
        }, {
            title: "罩杯",
            mode: "select",
            choice: ["A", "B", "C", "D", "E", "F", "G"],
            genderLimit: "女",
            isNecessary: false
        }],
        bodyShapes: {
            "女": {
                "肩型": [{
                    "key": "常规",
                    "remark": "偶尔挂住单肩包"
                }, {
                    "key": "平肩",
                    "remark": "稳稳挂住单肩包"
                }, {
                    "key": "溜肩",
                    "remark": "完全挂不住单肩包"
                }],
                "背型": [{
                    "key": "挺腰",
                    "remark": "平时走路特别昂首挺胸"
                }, {
                    "key": "直背",
                    "remark": "正常体态或轻微驼背"
                }, {
                    "key": "驼背",
                    "remark": "背部有明显驼背"
                }],
                "胯型": [{
                    "key": "宽胯",
                    "remark": "胯部宽度明显大于肩部宽度"
                }, {
                    "key": "正常",
                    "remark": "胯部略大于肩部或者与肩部宽度等宽"
                }, {
                    "key": "窄胯",
                    "remark": "胯部宽度小于肩部宽度"
                }],
                "腹型": [{
                    "key": "凹陷",
                    "remark": "腹部向里瘪或者完全平坦"
                }, {
                    "key": "平坦",
                    "remark": "摸起来略有幅度"
                }, {
                    "key": "微凸",
                    "remark": "有轻微小肚腩现象"
                }, {
                    "key": "中凸",
                    "remark": "腹部突出明显"
                }, {
                    "key": "重凸",
                    "remark": "站立时无法看到脚"
                }],
                "腿型": [{
                    "key": "纤细",
                    "remark": "腿部较为纤细"
                }, {
                    "key": "正常",
                    "remark": "腿部肌肉整体均匀"
                }, {
                    "key": "粗壮",
                    "remark": "腿部肌肉明显突出"
                }],
                "裙装穿着习惯": [{
                    "key": "低腰裙",
                    "remark": "裙腰在肚脐以下，胯骨上下"
                }, {
                    "key": "高腰裙",
                    "remark": "裙腰在腰围线上方"
                }],
                "裤装穿着习惯": [{
                    "key": "低腰裤",
                    "remark": "裤腰处于胯骨上方，明显低于腰围线"
                }, {
                    "key": "高腰裤",
                    "remark": "裤腰高于腰围线"
                }]
            },
            "男": {
                "肩型": [{
                    "key": "常规",
                    "remark": "肩部与颈部呈轻微夹角"
                }, {
                    "key": "平肩",
                    "remark": "肩部基本呈现水平状态"
                }, {
                    "key": "溜肩",
                    "remark": "肩部与颈部夹角较大"
                }],
                "背型": [{
                    "key": "挺腰",
                    "remark": "平时走路特别昂首挺胸"
                }, {
                    "key": "直背",
                    "remark": "正常体态或轻微驼背"
                }, {
                    "key": "驼背",
                    "remark": "背部有明显驼背"
                }],
                "胸型": [{
                    "key": "平坦",
                    "remark": "少量肌肉或脂肪，正常体态"
                }, {
                    "key": "肌肉",
                    "remark": "健身达人，胸部有明显肌肉轮廓"
                }, {
                    "key": "肥大",
                    "remark": "有明显脂肪堆积"
                }],
                "腹型": [{
                    "key": "凹陷",
                    "remark": "腹部往里收或完全平整"
                }, {
                    "key": "平坦",
                    "remark": "摸起来略有幅度"
                }, {
                    "key": "微凸",
                    "remark": "有小肚腩"
                }, {
                    "key": "中凸",
                    "remark": "腹部突出明显"
                }, {
                    "key": "重凸",
                    "remark": "站立时无法看到脚"
                }],
                "腿型": [{
                    "key": "纤细",
                    "remark": "腿部较为纤细"
                }, {
                    "key": "正常",
                    "remark": "腿部肌肉整体均匀"
                }, {
                    "key": "粗壮",
                    "remark": "腿部肌肉明显突出"
                }],
                "穿着习惯": [{
                    "key": "修身",
                    "remark": "版型收身，腰部贴合人体"
                }, {
                    "key": "正常",
                    "remark": "正常版型，整体呈现直筒造型"
                }, {
                    "key": "宽松",
                    "remark": "版型宽松，腰围和下摆处肥大"
                }],
            }
        }
    },
    onShow: function(options) {
        var that = this
        wx.getStorage({
            key: 'AIMeasureData',
            success: function(res) {
                that.setData({
                    AIMeasureData: res.data
                })
                wx.removeStorage({
                    key: 'AIMeasureData'
                })
            },
        })
    },
    onChange: function(e) {
        var key = e.currentTarget.dataset.key
        var valOld = this.data.userData.性别
        var val = e.detail.value
        if (e.currentTarget.dataset.mode == "select") val = this.data.inputs[e.currentTarget.dataset.id]["choice"][val]
        var data = this.data.userData
        if (key == "性别" && !(valOld == undefined && val == "男") && !(valOld == val)) {
            var bodyShapes = this.data.bodyShapes
            var bs = bodyShapes[val == "男" ? "女" : "男"]
            for (var i in bs) {
                delete data[i]
            }
        }
        data[key] = val
        this.setData({
            userData: data
        })
    },
    onPicChage: function(e) {
        this.setData({
            ["userData." + e.currentTarget.dataset.key]: e.currentTarget.dataset.value
        })
    },
    disabledTip: function() {
        wx.showToast({
            title: "进行AI量体后不能修改数据",
            icon: "none"
        })
    },
    checkInput: function(debug = false) {
        var userData = this.data.userData
        var inputs = this.data.inputs
        for (var i in inputs) {
            if (debug) console.log("正在检测：", inputs[i])
            var t = inputs[i]["title"]
            var genderLimit = inputs[i]["genderLimit"]
            if ((userData[t] == undefined || userData[t] == "") && inputs[i]["isNecessary"] && (genderLimit == undefined || genderLimit == userData["性别"])) {
                if (debug) console.log(inputs[i], "验证失败")
                wx.showToast({
                    title: '请输入' + t,
                    icon: "none"
                })
                return false
            }
        }
        return true
    },
    goAIMeasure: function() {
        var that = this
        if (!this.checkInput()) return
        wx.showModal({
            title: 'AI量体提示',
            content: 'AI量体将使用您填写的个人数据，请确保您填写的数据正确。\nAI量体完成后，您将不能修改个人数据，但穿着习惯和体形特征仍可以进行修改。',
            success(res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: "pages/yltmeasure/measure?userGender=" + (that.data.userData.性别 == "男" ? 1 : 0) + "&userHeight=" + that.data.userData.身高 + "&userWeight=" + that.data.userData.体重 + "&userName" + that.data.姓名
                    })
                }
            }
        })
    },
    submit: function() {
        if (!this.checkInput()) return
        var userData = this.data.userData
        var bodyShapes = this.data.bodyShapes[userData["性别"]]
        for (var i in bodyShapes) {
            if (userData[i] == undefined) {
                wx.showToast({
                    title: '请选择' + i,
                    icon: "none"
                })
                return
            }
        }
        if (this.data.AIMeasureData.recordId == undefined) {
            var that = this
            wx.showModal({
                title: '提示',
                content: '您还没有进行AI量体，使用AI量体功能有助于我们获取更精确的尺寸，要不要试一试？',
                cancelText: "我想试试",
                confirmText: "我不要！",
                success(res) {
                    if (res.confirm) {
                        this.upload()
                    } else if (res.cancel) {
                        wx.navigateTo({
                            url: "pages/yltmeasure/measure?userGender=" + (that.data.userData.性别 == "男" ? 1 : 0) + "&userHeight=" + that.data.userData.身高 + "&userWeight=" + that.data.userData.体重 + "&userName" + that.data.姓名
                        })
                    }
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '请核对您的尺寸数据，一经提交不能修改，只能重新填写！',
                cancelText: "我再看看",
                confirmText: "确认提交",
                success(res) {
                    if (res.confirm) {
                        this.upload()
                    }
                }
            })
        }
    },
    upload: function() {
        var that = this
        wx.request({
            url: app.config.RequestUrl + 'chicun/add',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                memberID: app.globalData.memberID,
                bodyShapeData: that.data.userData,
                bodyShapeDataAI: that.data.AIMeasureData
            },
            success: function(res) {
                if (res.data.result.status == 200) {
                    console.log("成功啦")
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
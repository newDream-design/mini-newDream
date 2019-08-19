Page({
    data: {
        userData: {},
        inputs: [{
            title: "姓名",
            mode: "input",
            type: "text",
            placeholder: "此姓名将被用于制作水洗标"
        }, {
            title: "性别",
            mode: "select",
            choice: ["男", "女"]
        }, {
            title: "年龄",
            unit: "岁",
            mode: "input",
            type: "number"
        }, {
            title: "身高",
            unit: "cm",
            mode: "input",
            type: "digit",
            placeholder: "例如175"
        }, {
            title: "体重",
            unit: "kg",
            mode: "input",
            type: "digit",
            placeholder: "例如60"
        }, {
            title: "腰围",
            unit: "cm",
            mode: "input",
            type: "digit",
            placeholder: "例如80"
        }, {
            title: "下胸围",
            mode: "select",
            choice: ["男生就不能有熊伟？", "68-72"]
        }, {
            title: "罩杯",
            mode: "select",
            choice: ["男生就不能有罩杯？", "A", "B", "C", "D", "E", "F", "G"]
        }],
        bodyShapes: {
            "女": {
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
                }],
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
                }]
            },
            "男": {
                "穿着习惯": [{
                    "key": "修身",
                    "remark": "版型收身，腰部贴合人体"
                }, {
                    "key": "宽松",
                    "remark": "版型宽松，腰围和下摆处肥大"
                }, {
                    "key": "正常",
                    "remark": "正常版型，整体呈现直筒造型"
                }],
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
                }]
            }
        }
    },
    onLoad: function(options) {

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
    goAIMeasure: function() {
        var userData = this.data.userData
        var inputs = this.data.inputs
        for (var i in inputs) {
            var t = inputs[i]["title"]
            if (userData[t] == undefined) {
                wx.showToast({
                    title: '请输入' + t,
                    icon: "none"
                })
                return
            }
        }
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
        wx.navigateTo({
            url: "pages/yltmeasure/measure?userData=" + JSON.stringify(this.data.userData),
        })
    }
})